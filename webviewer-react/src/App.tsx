import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);
  const [viewerType, setViewerType] = useState<'Iframe' | 'WebComponent' | null>(null);
  const instanceRef = useRef<any>(null);

  const disposeViewer = () => {
    if (instanceRef.current) {
      try {
        instanceRef.current.UI.dispose();
      } catch (e) {
        // Ignore disposal errors
      }
      instanceRef.current = null;
    }
    // Also clear the viewer container
    if (viewer.current) {
      (viewer.current as HTMLElement).innerHTML = '';
    }
  };

  const handleModeChange = (mode: 'Iframe' | 'WebComponent') => {
    disposeViewer();
    setViewerType(mode);
  };

  useEffect(() => {
    if (viewerType === null) return;

    const WebViewerConstructor = viewerType === 'WebComponent' ? WebViewer.WebComponent : WebViewer.Iframe;

    WebViewerConstructor(
      {
        path: '/lib/webviewer',
        initialDoc: 'https://apryse.s3.amazonaws.com/public/files/samples/WebviewerDemoDoc.pdf',
        licenseKey: 'YOUR_LICENSE_KEY',
        css: '/test.css',
      },
      viewer.current,
    ).then((instance) => {
      instanceRef.current = instance;
    });

    return () => {
      disposeViewer();
    };
  }, [viewerType]);

  return (
    <div className="App">
      <div className="header">
        <h1>WebViewer CSS Loading Test</h1>
        <p>Open DevTools Network tab, then click a button to load WebViewer</p>
        <p>Filter by "test.css" to see how many times the CSS file is loaded</p>
        <div style={{ marginTop: '15px', display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={() => handleModeChange('Iframe')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: viewerType === 'Iframe' ? '#2E7D32' : '#4CAF50',
              color: 'white',
              border: viewerType === 'Iframe' ? '3px solid white' : 'none',
              borderRadius: '4px',
            }}
          >
            Load with Iframe
          </button>
          <button
            onClick={() => handleModeChange('WebComponent')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: viewerType === 'WebComponent' ? '#C62828' : '#f44336',
              color: 'white',
              border: viewerType === 'WebComponent' ? '3px solid white' : 'none',
              borderRadius: '4px',
            }}
          >
            Load with WebComponent
          </button>
        </div>
        {viewerType && (
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
            Current Mode: {viewerType} {viewerType === 'Iframe' ? '(CSS loads once)' : '(CSS loads twice)'}
          </p>
        )}
      </div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
