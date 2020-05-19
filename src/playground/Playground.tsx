import * as Antd from 'antd';
import Axios from 'axios';
import 'codemirror/lib/codemirror.css';
// import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/python/python';
import 'codemirror/mode/vue/vue';
import 'codemirror/theme/material.css';
import immer from 'immer';
import _ from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import ReactDOM from 'react-dom';
import { DragSizing } from 'react-drag-sizing';
import Helmet from 'react-helmet';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components';
import useMedia from 'use-media';
import { GentleSpin } from '../components/GentleSpin';
import { useApi } from '../hooks/useApi';
import { useFormBinding } from '../hooks/useFormBinding';
import { useInterval } from '../hooks/useInterval';
import { useModel } from '../hooks/useModel';
import { useTrigger } from '../hooks/useTrigger';
import { codeTransform } from './codeTransform';
import './page.css';
import './print.css';
import { MainCol, MainRow, MountNode } from './styled';
import {
  appendCss,
  appendHtml,
  appendJs,
  displayError,
  loadCss,
  loadJs,
  loadJsForceUmd,
} from './util';

Object.assign(window, {
  useFormBinding,
  useInterval,
  useModel,
  moment,
  styled,
  immer,
  _,
  axios: Axios,
  Antd,
  React,
  ReactDOM,
  displayError,
  loadJsForceUmd,
  loadJs,
  loadCss,
  appendJs,
  appendCss,
  appendHtml,
  setRendering: _.noop, // noop placeholder
});

// let storeKeyCode = 'playground__initialCode';

export let Playground: React.FC = () => {
  let history = useHistory();
  let { file } = useParams() as { file: string };
  file = file || '';

  let isVue = file.endsWith('.vue');
  let isPy = file.endsWith('.py');
  let isMd = file.endsWith('.md');

  // let initialCode = useMemo(() => {
  //   return localStorage.getItem(storeKeyCode) || _initialCode;
  // }, []);
  let initialCode = '';
  let codeBinding = useFormBinding(initialCode, (editor, data, value) => value);

  let {
    request: reqCode,
    error: errReqCode,
    response: respCode,
    loading: loadingCode,
  } = useApi<string>('GET', 'code/:file');

  useEffect(() => {
    if (file) {
      reqCode({ pathParams: { file } });
    } else {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    if (respCode == null) return;
    codeBinding.controlled.onChange(null, null, respCode.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [respCode]);

  useEffect(() => {
    // if (errReqCode && String(errReqCode).includes('status code 404')) {
    //   history.push('/'); // force redirect
    // }
    if (errReqCode) {
      displayError(new Error(`${errReqCode.message} - ${file}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errReqCode]);

  let [preview, setPreview] = useState('');
  let [compiling, setCompiling] = useState(false);
  let [rendering, _setRendering] = useState(0);
  let previewLoading = loadingCode || compiling || rendering > 0;

  let addLoading = useCallback(() => {
    _setRendering(s => s + 1);
    return () => _setRendering(s => s - 1);
  }, []);

  Object.assign(window, { addLoading }); // without side-effect

  let doPreview = useCallback(
    async (code: string) => {
      if (!code) return;
      setCompiling(true);
      try {
        let res = await codeTransform(code, file);
        // console.log('res', res);
        setPreview(res);
      } catch (err) {
        displayError(err);
      } finally {
        setCompiling(false);
      }
    },
    [file]
  );

  // let persistEditor = useCallback((code: string) => {
  //   localStorage.setItem(storeKeyCode, code);
  // }, []);

  useTrigger(
    {
      debounce: 1000,
      // initial: true,
      cancel: true,
      singleton: true,
    },
    doPreview,
    [codeBinding.value]
  );
  window.triggerPreview = () => {
    // doPreview(codeBinding.value);
    doPreview(codeBinding.value + `\n\n/* ${new Date()} */`);
  };

  // useTrigger(
  //   {
  //     throttle: 1000,
  //   },
  //   persistEditor,
  //   [codeBinding.value]
  // );

  // keeping sync'd with styled.ts (medium=768px)
  let isGreaterThanMedium = useMedia({ minWidth: '768px' });

  let handleSizingUpdate = useCallback(() => {
    let event = new Event('resize');
    window.mountNode.dispatchEvent(event);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleSizingUpdate);
    return () => {
      window.removeEventListener('resize', handleSizingUpdate);
    };
  }, [handleSizingUpdate]);

  return (
    <div className="page-playground">
      <Helmet>
        <title>Playground{file ? ` - ${file}` : ''}</title>
        <style>{`html { overflow: hidden } #root { height: 100% }`}</style>
        <script>{preview}</script>
      </Helmet>
      <MainRow>
        <MainCol style={{ flex: 1, overflowX: 'auto' }}>
          <GentleSpin spinning={previewLoading}>
            <MountNode id="mountNode" />
            <div id="assetsNode" />
          </GentleSpin>
        </MainCol>
        <DragSizing
          className="editor-area"
          onUpdate={handleSizingUpdate}
          {...(isGreaterThanMedium
            ? {
                border: 'left',
                style: {
                  minWidth: '20%',
                  maxWidth: '80%',
                  width: '50%',
                },
              }
            : {
                border: 'top',
                style: {
                  minHeight: '20%',
                  maxHeight: '80%',
                  height: '50%',
                },
              })}
        >
          <MainCol>
            <CodeMirror
              className="main-editor"
              options={{
                mode: isMd
                  ? 'markdown'
                  : isVue
                  ? 'vue'
                  : isPy
                  ? 'python'
                  : 'text/typescript-jsx',
                theme: 'material',
                lineNumbers: true,
              }}
              value={codeBinding.controlled.value}
              onBeforeChange={codeBinding.controlled.onChange}
            />
          </MainCol>
        </DragSizing>
      </MainRow>
    </div>
  );
};
