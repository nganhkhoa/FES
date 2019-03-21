import React, { Component } from 'react';

import EncryptFolderForm from '@/components/EncryptFolderForm';

import '@/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <EncryptFolderForm />
      </div>
    );
  }
}

export default App;
