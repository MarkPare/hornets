import React from 'react';
import '../scss/ImageBrowser.scss';
import { CLASS_NAMES, getClassNameFromFileName, getName, parseUrlForKey } from '../utils';
import {debounce} from 'lodash'
import { RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react';
import store, {Mode, Image} from '../store';
import Menu from './Menu';

const DEFAULT_MODE = Mode.INCLUDE;

interface Option {
  name: string
  nameFormatted: string
}

// Currently just using "include" mode, though
// multiple class selection could be supported easily
const options = [
  // ...getClassData(),
  //{name: 'delete', nameFormatted: 'Delete'},
  {name: DEFAULT_MODE, nameFormatted: DEFAULT_MODE},
]

class ImageBrowser extends React.Component<Props, State> {

  container = React.createRef<HTMLDivElement>();

  state = {
    maxImages: 50,
    mode: DEFAULT_MODE,
  }

  constructor(props: Props) {
    super(props);
    this.handleScroll = debounce(this.handleScroll, 200, {leading: true});
    const dirName = parseUrlForKey('dirName', props.location.search) || '';
    if (dirName) {
      store.updateDirFilter(dirName)
    }
  }

  componentDidMount() {
    // Redirect to default dir if none selected
    // on page load
    const {location, history} = this.props;
    const dirName = parseUrlForKey('dirName', location.search) || '';
    if (!dirName) {
      const defaultDir = CLASS_NAMES.vespa_mandarinia;
      const url = `/browser?dirName=${defaultDir}`
      history.replace(url);
    }
  }

  handleSave = () => {
    store.saveImageData();
  }

  handleChange = (image: Image, option: Option) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    let nextClasses = [...image.selectedClasses]
    if (image.selectedClasses.includes(option.name)) {
      nextClasses = nextClasses.filter(cls => {
        return cls !== option.name;
      });
    }
    else {
      nextClasses.push(option.name);
    }
    const nextImage = {
      ...image,
      selectedClasses: nextClasses
    }
    store.updateImage(nextImage)
  }

  handleScroll = () => {
    const el = this.container.current;
    if (!el) return;
    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 1;
    if (isBottom) {
      const nextValue = this.state.maxImages + 50;
      this.setState({maxImages: nextValue})
    }
  }

  renderImage(image: Image) {
    return (
      <div className='image-container' key={image.src}>
        <img src={image.src} alt={image.fileName} />
        <div className='classes-container'>
          {options.map((option, index) => (
            <div className='checkbox-container' onClick={this.handleChange(image, option)} key={index}>
              <button className={image.selectedClasses.includes(option.name) ? `checkbox selected` : `checkbox`}>
              </button>
              <div className='checkbox-label'>
                {`${option.nameFormatted}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  renderImageBinaryMode(image: any) {
    const {mode} = store;
    const selected = image.selectedClasses.includes(mode);
    const cls = `image-container ${selected ? 'selected' : ''}`
    // Currently just using static first option
    // in 'include' or 'delete' mode
    return (
      <button className={cls} key={image.fileName} onClick={this.handleChange(image, options[0])}>
        <div className='image-inner'>
          <img src={image.src} alt={image.fileName} />
          <div className='desc'>
            <p>{getName(getClassNameFromFileName(image.fileName))}</p>
            <p>{image.fileName}</p>
          </div>
        </div>
        <div className='mask' />
      </button>
    )
  }

  renderImages() {
    const {mode} = store;
    const images = Object.values(store.filteredImageData).slice(0, this.state.maxImages)
    return images.map((image: any) => {
      switch (mode) {
        case Mode.INCLUDE:
        case Mode.DELETE: {
          return this.renderImageBinaryMode(image);
        }
        default:
          return this.renderImage(image)
      }
    })
  }

  render() {
    const {mode} = store
    const cls = `image-browser ${mode}`
    return (
      <div className={cls} onScroll={this.handleScroll} ref={this.container}>
        <Menu />
        <div className='images-container'>
          {this.renderImages()}
        </div>
      </div>
    );
  }
}

interface State {
  mode: Mode,
  maxImages: number,
}
interface Props extends RouteComponentProps {}

export default observer(ImageBrowser);
