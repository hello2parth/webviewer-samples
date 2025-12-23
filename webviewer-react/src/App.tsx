import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);
  const [viewerType, setViewerType] = useState<'Iframe' | 'WebComponent' | null>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (viewerType === null) return;

    if (instanceRef.current) {
      try {
        instanceRef.current.UI.dispose();
      } catch (e) {
        // Ignore disposal errors
      }
      instanceRef.current = null;
    }

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
        <h1>WebViewer CSS Loading Test</h1>
        <p>Open DevTools Network tab, then click a button to load WebViewer</p>
        <p>Filter by "test.css" to see how many times the CSS file is loaded</p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => setViewerType('Iframe')}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            Load with Iframe (CSS loads once)
          </button>
          <button
            onClick={() => setViewerType('WebComponent')}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            Load with WebComponent (CSS loads twice)
          </button>
        </div>
      </div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
