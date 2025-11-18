import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);
  const [viewerType, setViewerType] = useState(null); // 'Iframe' or 'WebComponent' or null
  const [status, setStatus] = useState('Click a button to load the document');
  const instanceRef = useRef(null);

  useEffect(() => {
    if (viewerType === null) return;

    const documentUrl = '/egnyte-api/rest/public/v1/quality-docs/documents/1e36c2c7-90ee-4d43-a209-310c1a1ea352/preview?xsrfToken=39fc331c-7644-4a87-82b5-2054642aca10%4089533522-a32e-4010-ad18-d1e7cdd48e39&deduplicationToken=' + Date.now() + '-' + Math.floor(Math.random() * 100000);

    if (instanceRef.current) {
      try {
        instanceRef.current.UI.dispose();
      } catch (e) {
        // Ignore disposal errors
      }
      instanceRef.current = null;
    }

    setStatus(`Loading with ${viewerType}...`);

    const WebViewerConstructor = viewerType === 'WebComponent' ? WebViewer.WebComponent : WebViewer.Iframe;

    WebViewerConstructor(
      {
        path: '/lib/webviewer',
        initialDoc: documentUrl,
        filename: 'document.pdf',
        extension: 'pdf',
        licenseKey: 'your_license_key',
      },
      viewer.current,
    ).then((instance) => {
      instanceRef.current = instance;
      setStatus(`${viewerType} initialized, loading document...`);
      const { documentViewer } = instance.Core;

      documentViewer.addEventListener('documentLoaded', () => {
        setStatus(`✅ Document loaded successfully with ${viewerType}!`);
      });

      documentViewer.addEventListener('loaderror', (err) => {
        setStatus(`❌ Error loading document with ${viewerType}: ${err.message || err}`);
      });
    }).catch((err) => {
      setStatus(`❌ Failed to initialize ${viewerType}: ${err.message || err}`);
    });

    return () => {
      if (instanceRef.current) {
        try {
          instanceRef.current.UI.dispose();
        } catch (e) {
          // Ignore disposal errors
        }
      }
    };
  }, [viewerType]);

  return (
    <div className="App">
      <div className="header">
        <h1>WebViewer Content-Disposition Test</h1>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setViewerType('Iframe')}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: viewerType === 'Iframe' ? '#4CAF50' : '#ddd',
              color: viewerType === 'Iframe' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Load with Iframe
          </button>
          <button
            onClick={() => setViewerType('WebComponent')}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: viewerType === 'WebComponent' ? '#4CAF50' : '#ddd',
              color: viewerType === 'WebComponent' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Load with WebComponent
          </button>
          <span style={{ marginLeft: '20px', fontSize: '14px' }}>{status}</span>
        </div>
      </div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
