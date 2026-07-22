const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
let storageModulePromise;

function getStorageModule() {
  storageModulePromise ||= import(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"
  );
  return storageModulePromise;
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("This browser could not compress the selected image."));
    }, type, quality);
  });
}

async function compressImage(file, { maxDimension, quality }) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("Please choose an image smaller than 15 MB.");
  }

  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { alpha: false });
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvasToBlob(canvas, "image/webp", quality);
}

export async function uploadReferenceImage(app, file, folder, options = {}) {
  const {
    maxDimension = 1200,
    quality = 0.75
  } = options;
  const { getStorage, ref, uploadBytes, getDownloadURL } = await getStorageModule();
  const compressed = await compressImage(file, { maxDimension, quality });
  const id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const imageRef = ref(getStorage(app), `reference-images/${folder}/${id}.webp`);

  await uploadBytes(imageRef, compressed, {
    contentType: "image/webp",
    cacheControl: "private,no-store,max-age=0"
  });
  return getDownloadURL(imageRef);
}

export function getStorageObjectPath(imageUrl) {
  if (imageUrl.startsWith("gs://")) return imageUrl;
  const parsedUrl = new URL(imageUrl);
  const encodedPath = parsedUrl.pathname.match(/\/o\/(.+)$/)?.[1];
  if (!encodedPath) throw new Error("The Storage image path could not be read.");
  return decodeURIComponent(encodedPath);
}

export async function deleteReferenceImage(app, imageUrl) {
  if (!imageUrl || imageUrl.startsWith("data:")) return;
  if (!imageUrl.startsWith("gs://") && !imageUrl.includes("firebasestorage.googleapis.com")) return;
  try {
    const { getStorage, ref, deleteObject } = await getStorageModule();
    const storage = getStorage(app);
    let imageRef;

    imageRef = ref(storage, getStorageObjectPath(imageUrl));

    await deleteObject(imageRef);
  } catch (error) {
    if (error?.code !== "storage/object-not-found") throw error;
  }
}

export async function deleteReferenceImagesFromHTML(app, html) {
  if (!html) return;
  const documentFragment = new DOMParser().parseFromString(html, "text/html");
  const urls = [...new Set(
    [...documentFragment.querySelectorAll("img[src]")].map(image => image.src)
  )];
  await Promise.all(urls.map(url => deleteReferenceImage(app, url)));
}
