import * as Antd from 'antd';
import 'codemirror/lib/codemirror.css';
// import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/theme/material.css';
import _ from 'lodash';
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
import { babelTransform } from './babelMaster';
import './page.css';
import { MainCol, MainRow, MountNode } from './styled';
import { displayError, loadScript, loadStyle } from './util';

Object.assign(window, {
  useFormBinding,
  useInterval,
  useModel,
  styled,
  Antd,
  React,
  ReactDOM,
  displayError,
  loadScript,
  loadStyle,
  setRendering: _.noop, // noop placeholder
});

// let storeKeyCode = 'playground__initialCode';

export let Playground: React.FC = () => {
  let history = useHistory();
  let { file } = useParams() as { file: string };
  // let initialCode = useMemo(() => {
  //   return localStorage.getItem(storeKeyCode) || _initialCode;
  // }, []);
  let initialCode = '';
  let codeBinding = useFormBinding(initialCode, (editor, data, value) => value);

  let {
    request: reqIndex,
    response: respIndex,
    loading: loadingIndex,
  } = useApi<string>('GET', 'code/index.yml');
  let { request: reqCode, response: respCode, loading: loadingCode } = useApi<
    string
  >('GET', 'code/:file');
  let preloading = loadingIndex || loadingCode;

  useEffect(() => {
    if (file) {
      reqCode({ pathParams: { file } });
    } else {
      reqIndex();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    if (respIndex == null) return;
    let txt = respIndex.data;
    let list = txt
      .split(/\n/)
      .filter(Boolean)
      .map(v => v.replace(/^-\s*/, ''));
    let defaults = list[0];
    // reqCode({ pathParams: { file: file || defaults } });
    history.push(`/playground/${file || defaults}`);
  }, [file, history, reqCode, respIndex]);

  useEffect(() => {
    if (respCode == null) return;
    codeBinding.controlled.onChange(null, null, respCode.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [respCode]);

  let [preview, setPreview] = useState('');
  let [compiling, setCompiling] = useState(false);
  let [rendering, setRendering] = useState(false);
  let previewLoading = preloading || compiling || rendering;

  Object.assign(window, { setRendering }); // without side-effect

  let doPreview = useCallback(async (code: string) => {
    if (!code) return;
    setCompiling(true);
    try {
      let res = await babelTransform(code);
      setPreview(res);
    } catch (err) {
      displayError(err);
    } finally {
      setCompiling(false);
    }
  }, []);

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

  // useTrigger(
  //   {
  //     throttle: 1000,
  //   },
  //   persistEditor,
  //   [codeBinding.value]
  // );

  // keeping sync'd with styled.ts (medium=768px)
  let isGreaterThanMedium = useMedia({ minWidth: '768px' });

  return (
    <div className="page-playground">
      <Helmet>
        <title>Playground</title>
        <style>{`html { overflow: hidden } #root { height: 100% }`}</style>
        <script>{preview}</script>
      </Helmet>
      <MainRow>
        <MainCol style={{ flex: 1 }}>
          <GentleSpin spinning={previewLoading}>
            <MountNode id="mountNode" />
          </GentleSpin>
        </MainCol>
        <DragSizing
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
                mode: 'text/typescript-jsx',
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
