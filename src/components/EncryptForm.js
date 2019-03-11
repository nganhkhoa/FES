import React from 'react';
import { connect } from 'react-redux';
import { Form, Upload, Button, Icon } from 'antd';

@connect(({ rpc }) => ({
  folderList: rpc.folderList
}))
@Form.create()
class EncryptFolderForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'rpc/encryptFolder',
          payload: {
            algo: 'RSA'
          }
        });
      }
    });
  };

  render() {
    const { folderList } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const beforeUpload = file => {
      const { dispatch } = this.props;
      dispatch({
        type: 'rpc/addFolder',
        payload: {
          file
        }
      });
      return false;
    };
    const onRemove = file => {
      const { dispatch } = this.props;
      dispatch({
        type: 'rpc/removeFolder',
        payload: {
          file
        }
      });
    };
    return (
      <div className="App">
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Upload">
            {getFieldDecorator('upload', {
              valuePropName: 'folderList',
              getValueProps: () => folderList
            })(
              <Upload
                onRemove={onRemove}
                beforeUpload={beforeUpload}
                fileList={folderList}
                directory
              >
                <Button>
                  <Icon type="upload" /> Choose Folder to Encrypt
                </Button>
              </Upload>
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Encrypt
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default EncryptFolderForm;
