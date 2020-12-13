import '../scss/FileInput.scss';
import React from 'react';
import Button from './Button';

export enum FILE_TYPES {
  png = 'image/png',
  jpg = 'image/jpeg',
  pdf = 'application/pdf',
}

const imageFileTypes: string[] = [FILE_TYPES.png, FILE_TYPES.jpg];

const getFileData = (file: File) => {
  const name = file.name;
  const type = file.type;
  return {name, type};
};

const getPreviewSrc = (file: File) => {
  return URL.createObjectURL(file);
};

interface FileItem {
  id: string
  file: File
}

export class FileInput extends React.Component<Props, State> {
  fileInput = React.createRef<HTMLInputElement>();

  state = {
    fileItems: [],
    fileInputKey: 0,
  }

  setFiles = (files: File[]) => {
    const fileItems = files.map(file => {
      return {file, id: '1'} as FileItem
    });
    this.setState({fileItems});
  }

  openFileInput = () => {
    if (this.fileInput.current) {
      this.fileInput.current.click();
    }
  }

  handleSubmit = () => {
    const files = this.state.fileItems.map((fileItem: FileItem) => fileItem.file);
    
    this.props.onSubmit({
      files,
    });
  }

  handleFileChange = (event: any) => {
    const {files} = event.target;
    const asArray = Array.from(files).map(file => ({file, id: '1'})) as FileItem[];
    this.setState({
      fileItems: asArray,
      fileInputKey: this.state.fileInputKey + 1,
    });
    const allFiles = asArray.map((fileItem: FileItem) => fileItem.file);
    return this.props.onSubmit({files: allFiles});
  }

  renderPreview = (fileItem: FileItem) => {
    const {name, type} = getFileData(fileItem.file);

    if (imageFileTypes.includes(type)) {
      return (
        <div key={fileItem.id} className='file-input-preview' title={name}>
          <div className='file-input-preview-thumbnail-container'>
            <img
              className='file-input-preview-thumbnail'
              src={getPreviewSrc(fileItem.file)}
              alt={name || 'preview'}
            />
          </div>
        </div>
      );
    }
    else {
      const title = name;
      return (
        <div key={fileItem.id} className='file-input-preview' title={name}>
          <div className='file-preview'>
            <div className='right-container'>
              <div className='file-name'>
                {title}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  renderFileInput() {
    return (
      <div className='file-input-file-input-container'>
        <input
          key={this.state.fileInputKey}
          className='file-input-input'
          type='file'
          multiple
          ref={this.fileInput}
          onChange={this.handleFileChange}
        />
      </div>
    );
  }

  renderPreviews() {
    const {fileItems} = this.state;
    if (!fileItems.length) return null;
    return fileItems.map((fileItem) => this.renderPreview(fileItem));
  }

  render() {
    const addLabel = this.state.fileItems.length
      ? 'Change file'
      : 'Upload file';
    return (
      <React.Fragment>
        {this.renderFileInput()}
        <div className='file-input'>
          <div className='add-files-section'>
            <Button
              label={addLabel}
              onClick={this.openFileInput}
              className='add-button'
            />
          </div>
          {/* <div className='previews-container'>
            <div className='previews-container-inner'>
              {this.renderPreviews()}
            </div>
          </div> */}
        </div>
      </React.Fragment>
    );
  }
}

interface State {
  fileItems: FileItem[]
  fileInputKey: number
}
interface Props {
  onSubmit: any
}

export default FileInput;
