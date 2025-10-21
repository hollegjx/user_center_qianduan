import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';
import {GITHUB_URL} from "@/constant";

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="Powered by Ant Desgin"
      links={[
        {
          key: 'xiaoTou',
          title: '小头',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <><GithubOutlined /> gjx Github</>,
          href: GITHUB_URL,
          blankTarget: true,
        },
        {
          key: 'fangRui',
          title: '方瑞',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
