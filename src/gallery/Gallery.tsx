import { Card, Col, Row, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useApi } from '../hooks/useApi';
import './page.css';
import { handleImageError } from './util';
import Helmet from 'react-helmet';

export let Gallery: React.FC = () => {
  let history = useHistory();

  let { request: reqIndex, loading: loadingIndex, getData: getIndex } = useApi<
    string,
    string[]
  >('GET', 'code/index.yml', resp => {
    if (!resp) return [];
    let txt = resp.data;
    let list = txt
      .split(/\n/)
      .filter(Boolean)
      .map(v => v.replace(/^-\s*/, ''));
    return list;
  });

  useEffect(() => {
    reqIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-gallery">
      <Helmet>
        <title>Gallery</title>
      </Helmet>
      <Spin spinning={loadingIndex}>
        <div className="main-container">
          <Row
            gutter={[
              { xs: 12, sm: 16 },
              { xs: 12, sm: 16 },
            ]}
          >
            {getIndex().map(id => {
              return (
                <Col key={id} xs={12} sm={12}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt=""
                        src={`code/${id}.png`}
                        onError={handleImageError}
                      />
                    }
                    onClick={() => {
                      history.push(`/playground/${id}`);
                    }}
                  >
                    <Card.Meta
                      title={id}
                      // description="www.instagram.com"
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </Spin>
    </div>
  );
};
