import React from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Button,
  Collapse,
  Input,
  Typography,
  Modal,
  message,
  Select
} from 'antd';

const { Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

@connect(({ rpc }) => ({
  newkey: rpc.key,
  newkeySuccess: rpc.createKeySuccess,
  fileList: rpc.fileList
}))
@Form.create()
class KeyForm extends React.Component {
  state = {
    showModal: false,
    name: '',
    algorithm: ''
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { name, algorithm } = values;
        this.setState({
          name,
          algorithm
        });
        dispatch({
          type: 'rpc/createKey',
          payload: {
            algo: algorithm
          }
        });
      }
    });
  };

  showModal = () => {
    this.setState({
      showModal: true
    });
  };

  hideModal = () => {
    this.setState({
      showModal: false
    });
  };

  download = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = [
      'text/plain',
      anchor.download,
      anchor.href
    ].join(':');
    anchor.click();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { newkey } = this.props;
    const { algorithm, name, showModal } = this.state;
    let modalData;

    if (newkey.length === 2) {
      modalData = (
        <Collapse accordion defaultActiveKey={['1']}>
          <Panel header="Public Key" key="1">
            <Button
              type="primary"
              icon="download"
              onClick={() =>
                this.download(newkey[0], algorithm + '_' + name + '.pub')
              }
            >
              Export key to file
            </Button>
            <Paragraph ellipsis={{ rows: 3, expandable: true }} copyable>
              {newkey[0]}
            </Paragraph>
          </Panel>
          <Panel header="Private Key" key="2">
            <Button
              type="primary"
              icon="download"
              onClick={() =>
                this.download(newkey[1], algorithm + '_' + name + '.pri')
              }
            >
              Export key to file
            </Button>
            <Paragraph ellipsis={{ rows: 3, expandable: true }} copyable>
              {newkey[1]}
            </Paragraph>
          </Panel>
        </Collapse>
      );
    } else if (newkey.length === 1) {
      modalData = (
        <Collapse accordion defaultActiveKey={['1']}>
          <Panel header="Key" key="1">
            <Button
              type="primary"
              icon="download"
              onClick={() =>
                this.download(newkey[0], algorithm + '_' + name + '.key')
              }
            >
              Export key to file
            </Button>
            <Paragraph ellipsis={{ rows: 3, expandable: true }} copyable>
              {newkey[0]}
            </Paragraph>
          </Panel>
        </Collapse>
      );
    } else {
      modalData = (
        <Collapse accordion defaultActiveKey={['1']}>
          <Panel header="Key" key="1">
            <Paragraph>No key is created</Paragraph>
          </Panel>
        </Collapse>
      );
    }

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="Key Name">
            {getFieldDecorator('name', {
              valuePropName: 'name',
              rules: [{ required: true, message: 'Please enter your key name' }]
            })(<Input placeholder="My key name" />)}
          </Form.Item>
          <Form.Item label="Algorithm" hasFeedback>
            {getFieldDecorator('algorithm', {
              valuePropName: 'algorithm',
              rules: [{ required: true, message: 'Please select an algorithm' }]
            })(
              <Select placeholder="Select an algorithm">
                <Option value="RSA">RSA</Option>
                <Option value="AES" disabled>
                  AES
                </Option>
                <Option value="ECC" disabled>
                  ECC
                </Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Key
            </Button>
          </Form.Item>
        </Form>
        <Button type="primary" onClick={this.showModal}>
          View created key
        </Button>
        <Modal
          title="Basic Modal"
          visible={showModal}
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          {modalData}
        </Modal>
      </div>
    );
  }
}

export default KeyForm;
