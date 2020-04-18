import { Col, Row } from 'antd';
import styled from 'styled-components';
import media from 'styled-media-query';

/**
 * https://github.com/morajabi/styled-media-query
 * export const defaultBreakpoints = {
    huge: '1440px',
    large: '1170px',
    medium: '768px',
    small: '450px',
  };
 */

export let MainRow = styled(Row)`
  height: 100%;
  display: flex;

  ${media.lessThan('medium')`
    flex-direction: column;
  `}
`;

export let MainCol = styled(Col)`
  height: 100%;
`;

export let MountNode = styled.div`
  height: 100%;
  min-height: 100px;
  overflow-y: auto;
  word-break: break-word;
`;

export let ErrorInfo = styled.pre`
  font-size: 12px;
  color: red;
  white-space: pre-wrap;
  padding: 10px;
`;
