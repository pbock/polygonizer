import Polygonizer from './polygonizer';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const p = new Polygonizer(canvas);

const iFile = document.getElementById('i_file') as HTMLInputElement;
const iSides = document.getElementById('i_sides') as HTMLInputElement;
const iRotation = document.getElementById('i_rotation') as HTMLInputElement;
const btnSave = document.getElementById('btn_save') as HTMLButtonElement;

const dropzone = document.getElementById('dropzone') as HTMLButtonElement;
const dropzoneOverlay = document.getElementById(
  'dropzone-overlay',
) as HTMLButtonElement;

iSides.addEventListener('input', (ev) => {
  const target = ev.currentTarget as HTMLInputElement;
  let newValue = parseFloat(target.value);
  if (newValue === 6) {
    if (p.sides < 6) newValue = 7;
    else newValue = 5;
    target.value = newValue as any;
  }
  p.sides = newValue;
});

iRotation.addEventListener('input', (ev) => {
  const rotation = parseFloat((ev.currentTarget as HTMLInputElement).value);
  p.rotation = rotation;
  [...document.querySelectorAll('[data-output="rotation"]')].forEach(
    (output) => (output.textContent = rotation.toFixed(1).replace('-', '−')),
  );
});

function imageFromFile(file: File): HTMLImageElement {
  const url = URL.createObjectURL(file);
  const img = document.createElement('img');
  img.src = url;
  img.addEventListener('error', () => {
    console.log('Could not load image');
  });
  img.addEventListener('load', () => {
    document.body.classList.add('has-image');
  });
  return img;
}

window.addEventListener('drop', (ev) => {
  ev.preventDefault();
  p.isDragging = false;
  document.body.classList.remove('is-dragging');

  for (let i = 0; i < ev.dataTransfer.items.length; i++) {
    const item = ev.dataTransfer.items[i];
    if (isImage(item)) {
      const file = item.getAsFile();
      p.image = imageFromFile(file);
      return;
    }
  }
});

window.addEventListener('dragover', (ev) => {
  ev.preventDefault();
  for (let i = 0; i < ev.dataTransfer.items.length; i++) {
    const item = ev.dataTransfer.items[i];
    if (isImage(item)) {
      p.isDragging = true;
      document.body.classList.add('is-dragging');
      return;
    }
  }
});

window.addEventListener('dragleave', () => {
  p.isDragging = false;
  document.body.classList.remove('is-dragging');
});

iFile.addEventListener('change', (ev) => {
  const target = ev.currentTarget as HTMLInputElement;
  p.image = imageFromFile(target.files[0]);
});

btnSave.addEventListener('click', () => {
  download();
});

dropzone.addEventListener('click', () => {
  iFile.click();
});

function download() {
  const a = document.createElement('a');
  a.download = 'profile.png';
  a.href = p.canvas.toDataURL('image/png');
  a.click();
}

function isImage(file: DataTransferItem): boolean {
  return file.kind === 'file' && file.type.split('/')[0] === 'image';
}
