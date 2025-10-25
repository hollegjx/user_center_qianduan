import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import {
  // FormattedMessage, // 移除国际化
  Helmet,
  history,
  // SelectLang, // 移除国际化
  // useIntl, // 移除国际化
  useModel,
} from '@umijs/max';
import { Alert, App, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { Footer } from '@/components';
import {login, register} from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import Settings from '../../../../config/defaultSettings';
import {GITHUB_URL, SYSTEM_LOGO} from "@/constant";

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const ActionIcons = () => {
  const { styles } = useStyles();

  return (
    <span>
      <AlipayCircleOutlined
        key="AlipayCircleOutlined"
        className={styles.action}
      />
      <TaobaoCircleOutlined
        key="TaobaoCircleOutlined"
        className={styles.action}
      />
      <WeiboCircleOutlined
        key="WeiboCircleOutlined"
        className={styles.action}
      />
    </span>
  );
};

// 移除国际化语言切换组件
// const Lang = () => {
//   const { styles } = useStyles();

//   return (
//     <div className={styles.lang} data-lang>
//       {SelectLang && <SelectLang />}
//     </div>
//   );
// };

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Register: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();
  // const intl = useIntl(); // 移除国际化

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.RegisterParams) => {
    const{userAccount,userPassword,checkPassword } = values;
    if(userPassword!== checkPassword){
      message.error("两次密码输入不一致");
      return;
    }
    try {
      const result = await register(values);
      console.log('注册响应:', result);

      // 适配后端响应格式：code === 0 表示成功
      if (result.code === 0) {
        const successMessage = result.message || '注册成功！';
        message.success(successMessage);

        // 设置临时用户信息
        const loginUser = {
          id: result.data || 0,
          userAccount: values.userAccount || '',
          username: values.userAccount || '',
        };

        flushSync(() => {
          setInitialState((s) => ({
            ...s,
            currentUser: loginUser,
          }));
        });

        try {
          await fetchUserInfo();
        } catch (error) {
          console.log('获取用户信息失败，使用注册数据:', error);
        }

        // 使用 setTimeout 确保 state 更新完成后再跳转
        setTimeout(() => {
          const urlParams = new URL(window.location.href).searchParams;
          const redirectPath = urlParams.get('redirect') || '/welcome';

          // Hash 路由模式下，直接修改 hash
          window.location.hash = `#${redirectPath}`;
        }, 100);
        return;
      }

      // 注册失败
      const errorMessage = result.message || '注册失败';
      message.error(errorMessage);
      console.log('注册失败:', result);
    } catch (error) {
      console.log('注册异常:', error);
      message.error('注册失败，请重试！');
    }
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>注册页{Settings.title && ` - ${Settings.title}`}</title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          submitter={{
            searchConfig: {
              submitText:'注册'
            }
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="注册账号"
          subTitle={<a href={GITHUB_URL}>"最好的程序员社区"</a>}
          initialValues={{
            autoLogin: true,
          }}
          actions={[
            '其他注册方式',
            <ActionIcons key="icons" />,
          ]}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >


          {status === 'error' && loginType === 'account' && (
            <LoginMessage content="账户或密码错误" />
          )}
          {type === 'account' && (
            <div>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder="请输入账户"
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder="请确认密码"
                rules={[
                  {
                    required: true,
                    message: '这是必填项!',
                  },
                ]}
              />
            </div>
          )}

          {status === 'error' && loginType === 'mobile' && (
            <LoginMessage content="验证码错误" />
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
