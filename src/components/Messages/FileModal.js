import React, { Component } from 'react'
import mime from 'mime-types'
import { Modal, Input, Button, Icon } from 'semantic-ui-react'

export default class FileModal extends Component {
  // 상태
  state = {
    file: null,
    validFileTypes: ['images/jpeg', 'images/png'],
  }

  // 이벤트 핸들러
  handleInput = ({ target }) => {
    const file = target.files[0]
    console.log('file:', file)

    if (file) {
      this.setState({ file })
    }
  }

  handleUploadFile = () => {
    const { file } = this.state
    const { uploadFile, closeModal } = this.props

    // 업로드 할 파일이 있고 업로드 가능한 파일 타입인 경우
    if (file !== null && !this.isValidFileType(file.name)) {
      // 메타데이터 설정
      const metadata = {
        contentType: mime.lookup(file.name),
      }

      // 파일 업로드
      uploadFile(file, metadata)
      // 모달 닫기
      closeModal()
      // file 상태 비우기
      this.clearFile()
    }
  }

  // 메서드
  isValidFileType = (fileName) => {
    this.state.validFileTypes.includes(mime.lookup(fileName))
  }

  clearFile = () => {
    this.setState({ file: null })
  }

  render() {
    const { modal, closeModal } = this.props

    return (
      <Modal
        size="small"
        dimmer="inerted"
        basic
        open={modal}
        onClose={closeModal}
      >
        <Modal.Header>이미지(미디어) 파일 업로드</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            label="파일 타입(JPEG, PNG)"
            type="file"
            name="file"
            onInput={this.handleInput}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="teal" onClick={this.handleUploadFile}>
            <Icon name="checkmark" /> 전송
          </Button>
          <Button color="grey" onClick={closeModal}>
            <Icon name="cancel" /> 취소
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
