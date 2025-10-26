import type { ProColumns } from '@ant-design/pro-components';
import {
  EditableProTable,
  ProCard,
  ProFormField,
  ProFormRadio,
} from '@ant-design/pro-components';
import React, { useState } from 'react';
import {searchUsers} from "@/services/ant-design-pro/api";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};



export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly API.CurrentUser[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>(
    'bottom',
  );

  const columns: ProColumns<API.CurrentUser>[] = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
      width: 50,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      copyable: true,
      width: 50,
    },
    {
      title:'头像',
      dataIndex: 'avatarUrl',
      copyable: true,
      width: 50,
      render: (_, record) => (
        <div>
          <img src={record.avatarUrl || ' '} alt="头像" />
        </div>
      )
    },
    {
      title:'性别',
      dataIndex: 'gender',
      width: 50,
    },
    {
      title:'电话',
      dataIndex: 'phone',
      width: 50,
    },
    {
      title:'邮箱',
      dataIndex: 'email',
      width: 50,
    },
    {
      title:'用户状态',
      dataIndex: 'userStatus',
      width: 50,
    },
    {
      title:'角色',
      dataIndex: 'userRole',
      width: 50,
    },
    {
      title:'创建时间',
      dataIndex: 'createTime',
      width: 50,
    },
  ];

  return (
    <>
      <EditableProTable<API.CurrentUser>
        rowKey="id"
        headerTitle="可编辑表格"
        maxLength={5}
        scroll={{
          x: 960,
        }}
        recordCreatorProps={
          position !== 'hidden'
            ? {
              position: position as 'top',
              record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
            }
            : false
        }
        loading={false}
        toolBarRender={() => [
          <ProFormRadio.Group
            key="render"
            fieldProps={{
              value: position,
              onChange: (e) => setPosition(e.target.value),
            }}
            options={[
              {
                label: '添加到顶部',
                value: 'top',
              },
              {
                label: '添加到底部',
                value: 'bottom',
              },
              {
                label: '隐藏',
                value: 'hidden',
              },
            ]}
          />,
        ]}
        columns={columns}
        request={async (params, sort, filter) => {
          console.log('请求参数:', params, sort, filter);
          try {
            const res = await searchUsers();
            console.log('用户列表响应:', res);

            // 适配后端返回格式：可能直接是数组，也可能包裹在对象中
            const userList = Array.isArray(res) ? res : (res?.data || []);

            return {
              data: userList,
              success: true,
              total: userList.length,
            };
          } catch (error) {
            console.error('获取用户列表失败:', error);
            // 临时返回空数据，避免页面崩溃
            // TODO: 后端实现 /api/user/search 接口后移除此处
            return {
              data: [],
              success: true, // 改为 true，避免一直重试
              total: 0,
            };
          }
        }}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            await waitTime(2000);
          },
          onChange: setEditableRowKeys,
        }}
      />
      <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
        <ProFormField
          ignoreFormItem
          fieldProps={{
            style: {
              width: '100%',
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard>
    </>
  );
};
