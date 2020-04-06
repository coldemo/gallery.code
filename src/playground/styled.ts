import { Col, Row } from 'antd';
import styled from 'styled-components';

export let MainRow = styled(Row)`
  height: 100%;
  display: flex;
`;

export let MainCol = styled(Col)`
  height: 100%;
`;

export let MountNode = styled.div`
  height: 100%;
`;

export let ErrorInfo = styled.pre`
  font-size: 12px;
  color: red;
  white-space: pre-wrap;
  padding: 10px;
`;
