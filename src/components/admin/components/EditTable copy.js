import { useEffect, useState } from "react";
import { adminCategoriesServices } from "../../../services/admin/categories-services";
import { adminProductsServices } from "../../../services/admin/products-services";
import { Form, Input, InputNumber, Select, Table, Typography, Popconfirm, message, Row, Col, Divider } from "antd";

export const EditTable = ({columns, dataSource, isCategoriesList, isSubCategoriesList, ...rest}) => {
  const [ form ] = Form.useForm();
  const [ editingKey, setEditingKey ] = useState('');
  const [ selectedRows, setSelectedRows ] = useState([]);
  const [ data, setData ] = useState([]);
  const isEditing = (record) => record._id === editingKey;

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (record) => {
    try {
      const row = await form.validateFields();
      let updatedValue;
      if (isCategoriesList) {
        updatedValue = await adminCategoriesServices.updateCategory({...row, _id: record._id });
      } else if (isSubCategoriesList) {
        updatedValue = await adminCategoriesServices.updateSubCategory({...row, _id: record._id });
      } else {
        updatedValue = await adminProductsServices.updateProduct({...row, _id: record._id});
      }
      const newData = [...dataSource];
      const index = newData.findIndex((item) => record._id === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...updatedValue,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(updatedValue);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {

    const inputNode = inputType === 'number'
    ? <InputNumber />
    : dataIndex === 'category_id'
    ? <Select options={[{label: "a", value:'a'}]} />
    : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const remove = async (record) => {
    try {
      if (isCategoriesList) {
        await adminCategoriesServices.removeCategory(record._id)
        message.success('Removed');
      } else if (isSubCategoriesList) {
        await adminCategoriesServices.removeSubCategory(record._id);
        message.success('Removed');
      } else {
        await adminProductsServices.removeProduct(record._id);
        message.success('Removed');
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => {
        return {
          record,
          inputType: col.dataIndex === 'price' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }
      },
    };
  });

  mergedColumns.push({
    title: 'Actions',
    key: 'action',
    width: '250',
    fixed: 'right',
    render: (_, record) => {
      const editable = isEditing(record);
      return editable ? (
        <Row align={'middle'}>
          <Col>
            <Popconfirm title="Are you sure?" onCancel={cancel} onConfirm={() => save(record)}>
              <Typography.Link>
                Save
              </Typography.Link>
            </Popconfirm>
          </Col>
          <Divider type="vertical" />
          <Col>
            <Typography.Link onClick={cancel}>
              Cancel
            </Typography.Link>
          </Col>
        </Row>
      ) : (
        <Row align={'middle'}>
          <Col>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
          </Col>
          <Divider type="vertical" />
          <Col>
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => remove(record)}
            >
              <Typography.Link disabled={editingKey !== ''}>
                Delete
              </Typography.Link>
            </Popconfirm>
          </Col>
        </Row>
      );
    },
  });

  return (
    <Form form={form}>
      <Table
        {...rest}
        bordered
        columns={mergedColumns}
        dataSource={data}
        rowClassName="editable-row"
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        pagination={{
          onChange: cancel,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows)
          }
        }}
      />
    </Form>
  );
};