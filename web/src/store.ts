import {observable, action, makeObservable, computed} from 'mobx';
import { downloadObjectAsJson, getClassNameFromFileName, getFileNameFromSrc } from './utils';

const STORAGE_KEY = 'imageData';

export enum Mode {
  DELETE = 'delete',
  INCLUDE = 'include',
}

export interface Image {
  src: string
  fileName: string
  selectedClasses: string[]
}

export type ImageData = Record<string, Image>


function importAll(r: any) {
  return r.keys().map(r);
}
// NOTE: Can NOT pass a variable as dir path to context
// unfortunately, so use a static parent dir and recurse
// through subdirs (second arg boolean for recursion)
// https://github.com/webpack/webpack/issues/9300
const ALL_IMAGES = process.env.NODE_ENV === 'production'
  ? []
  : importAll((require as any).context('./image-data', true, /\.(png|jpe?g|svg)$/));

const getImageDataFromDir = () => {
  const initialImageData: ImageData = {};
  ALL_IMAGES
    .forEach((src: string) => {
    const fileName = getFileNameFromSrc(src);
    initialImageData[fileName] = {
      src,
      fileName,
      selectedClasses: [getClassNameFromFileName(fileName)]
    }
  })

  return initialImageData;
}

export const getImageDataFromLocalStorage = () => {
  return localStorage.getItem(STORAGE_KEY);
}

export const setImageDataToLocalStorage = (imageData: ImageData) => {
  return localStorage.setItem(STORAGE_KEY, JSON.stringify(imageData));
}

const getInitialImageData = (): {imageData: ImageData, fromLocalStorage: boolean} => {
  const dataFromStorage = getImageDataFromLocalStorage();
  if (dataFromStorage) {
    return {
      imageData: JSON.parse(dataFromStorage),
      fromLocalStorage: true,
    };
  }
  else {
    return {
      imageData: getImageDataFromDir(),
      fromLocalStorage: false,
    };
  }
}

export class Store {
  imageData: ImageData = {};
  mode: Mode = Mode.INCLUDE;
  dirFilter: string = 'vespa_velutina';

  constructor() {
    const {imageData, fromLocalStorage} = getInitialImageData();
    this.imageData = imageData;
    if (!fromLocalStorage) {
      setImageDataToLocalStorage(imageData);
    }
    makeObservable(this, {
      imageData: observable,
      mode: observable,
      dirFilter: observable,
      filteredImageData: computed,
      updateImageData: action,
      updateImage: action,
      updateDirFilter: action,
    });
  }

  get filteredImageData() {
    const data: ImageData = {}
    const dirFilter = this.dirFilter
    Object.values(this.imageData).forEach((image: any) => {
      if (image.src.indexOf(dirFilter) > -1) {
        data[image.fileName] = image;
      }
    })
    return data;
  }

  clearData() {
    const imageData = getImageDataFromDir();
    setImageDataToLocalStorage(imageData);
    this.imageData = imageData;
  }

  updateImageData(nextData: ImageData) {
    this.imageData = nextData;
  }

  updateImage(nextImage: Image) {
    this.imageData[nextImage.fileName] = nextImage;
    setImageDataToLocalStorage(this.imageData);
  }

  updateDirFilter(dirFilter: string) {
    this.dirFilter = dirFilter;
  }

  saveImageData() {
    const selected: string[] = []
    Object.values(this.imageData).forEach((image: Image) => {
      if (image.selectedClasses.includes(this.mode)) {
        selected.push(image.fileName);
      }
    });
    const asObject = {data: selected}
    downloadObjectAsJson(asObject, 'hornets-data');
  }
}

export default new Store();
