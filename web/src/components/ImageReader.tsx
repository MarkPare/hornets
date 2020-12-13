import React from 'react';
import '../scss/ImageReader.scss';
import background from '../assets/images/murder-hornet.jpg';
import FileInput from './FileInput';

const nameMapping = {
  vespa_mandarinia: 'Asian giant hornet',
  sphecius_speciosus: 'Cicada killer',
  sphex_ichneumoneus: 'Great golden digger wasp',
} as Record<string, string>

const getName = (key: string): string => {
  return nameMapping[key] || 'Unknown'
}

const getHost = (): string => {
  const {protocol, host} = window.location;
  return `${protocol}//${host}`;
}
const urlRoot = window.location.host.startsWith('localhost')
  ? 'http://localhost:5000'
  : getHost();

const getPrediction = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = `${urlRoot}/predict`;
    const formData = new FormData();
    formData.append('file', file);

    fetch(url, {
      method: 'POST',
      body: formData,
    })
    .then((response: any) => response.json())
    .then((json: any) => {
      resolve(json.prediction)
    })
    .catch((error) => {
      console.log('error', error)
      reject(error)
    })
  })
}


class ImageReader extends React.Component<Props, State> {

  state = {
    result: '',
    loading: false,
  }

  fileInput:any = null

  handleSubmit = (params: {files: File[]}) => {
    const {files} = params
    const file = files[0];
    if (!file) return;
    this.setState({loading: true});
    getPrediction(file)
    .then(result => {
      this.setState({
        result,
        loading: false,
      })
    })
    .catch(() => {
      this.setState({loading: false});
    })
  }

  renderFileInput() {
    return (
      <div className="file-input-container">
        {/* <input
          className="file-input"
          type="file"
          ref={el => this.fileInput = el}
          onChange={this.handleFileChange}
        /> */}
        <FileInput onSubmit={this.handleSubmit} />
      </div>
    )
  }

  render() {
    const pretitle = 'Is that an'
    const title = 'Asian Giant Hornet?'
    //const subtitle = 'Upload image';

    return (
      <div className="image-reader">
        <img src={background} alt="hornet" className='background' />
        <div className="content-container">
          <div className="content-inner">
          <div className='copy'>
            <h3 className='pretitle'>{pretitle}</h3>
            <h1 className='title' dangerouslySetInnerHTML={{__html: title}}></h1>
          </div>
          <div className="file-input-section">
            <div className='left'>
              {/* <div className='subtitle'>
                {subtitle}
              </div> */}
            </div>
            {this.renderFileInput()}
          </div>
          {(this.state.loading) &&
            <div className='loading'>Processing...</div>
          }
          {(this.state.result && !this.state.loading) &&
            <p className="result-container">
              {getName(this.state.result)} 
            </p>
          }
          </div>
        </div>
      </div>
    );
  }
}

interface Props {};
interface State {
  result?: string
  loading: boolean
};

export default ImageReader;
