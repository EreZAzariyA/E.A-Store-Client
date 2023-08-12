import { useState } from "react";
import { useSelector } from "react-redux"
import { OrderSummary } from "./order-summary";
import { CustomDivider } from "../components/Divider";
import { ordersServices } from "../../services/orders-services";
import { getEmail, getFullName } from "../../utils/helpers";
import { Button, Checkbox, Col, Form, Input, Row } from "antd"
import "./order.css";

export const Order = ({ order, products, totalPrice, onBack }) => {
  const user = useSelector((state) => state.auth?.user);
  const shoppingCart = useSelector((state) => state.shoppingCart);
  const [form] = Form.useForm();
  const [isDetailsLock, setIsDetailsLock] = useState(false);

  const [initialValues, setInitialValues] = useState({
    first_name: user.profile?.first_name || '',
    last_name: user.profile?.last_name || '',
    phone: order?.phone || '',
    address: order?.address || '',
    isBusiness: order?.isBusiness || false,
    invoice_name: order?.invoice_name,
    invoice_address: order?.invoice_address,
  });

  const onFinish = async (values) => {
    setInitialValues(values);
    setIsDetailsLock(true);
  };

  const onProceedToPayment = async () => {
    if (!form.isFieldValidating()) {
      try {
        await form.validateFields();
        setIsDetailsLock(true);
        const order = {
          ...initialValues,
          products,
          totalPrice,
          user_id: user?._id,
          shoppingCart_id: shoppingCart?._id
        };
        const createdOrder = await ordersServices.createOrder(order);
        if (createdOrder) {
          console.log(createdOrder);
        }
      } catch (err) {
        const fields = err.errorFields;
        const firstFieldWithError = fields?.[0]?.name;
        form.scrollToField(firstFieldWithError, { behavior: "smooth" });
      }
    }
  };

  return (
    <div className="order-page">
      <h4>Order page</h4>

      <div className="go-back">
        <Button type="link" onClick={onBack}>Back to previous page</Button>
      </div>

      {!isDetailsLock && (
        <div className="order-form">
          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={onFinish}
          >
            <Row wrap justify={'center'} align={'top'} gutter={[30, 10]}>
              <Col span={6}>
                <Form.Item
                  label="First Name"
                  name="first_name"
                  rules={[{required: true, message: 'First name is missing'}]}
                >
                  <Input onChange={(val) => setInitialValues({...initialValues, first_name: val.target.value})} />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label="Last Name"
                  name="last_name"
                  rules={[{required: true, message: 'Last name is missing'}]}
                >
                  <Input onChange={(val) => setInitialValues({...initialValues, last_name: val.target.value})} />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label="Phone number"
                  name="phone"
                  rules={[{required: true, message: 'Phone number is missing'}]}
                  onChange={(val) => setInitialValues({...initialValues, phone: val.target.value})}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Address"
                  name="address"
                  rules={[{required: true, message: 'Address is missing'}]}
                  onChange={(val) => setInitialValues({...initialValues, address: val.target.value})}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row wrap justify={'center'} align={'top'} gutter={[20, 10]}>
              <Col span={24}>
                <Form.Item
                  name={'isBusiness'}
                  valuePropName="checked"
                >
                  <Checkbox
                    checked={initialValues.isBusiness}
                    onChange={(e) => setInitialValues({ ...initialValues, isBusiness: e.target.checked })}
                  >
                    I would like the name on the invoice to be different from the customer's name (for example, the name of a business)
                  </Checkbox>
                </Form.Item>
              </Col>

              {initialValues.isBusiness && (
                <>
                  <CustomDivider
                    orientation="center"
                    style={{ margin: '0' }}
                  >
                    Invoice details
                  </CustomDivider>

                  <Row wrap justify={'space-evenly'} align={'top'} gutter={[20, 10]}>
                    <Col>
                      <Form.Item
                        label="Invoice name"
                        name="invoice_name"
                      >
                        <Input placeholder="Optional"  onChange={(val) => setInitialValues({...initialValues, invoice_name: val.target.value})} />
                      </Form.Item>
                    </Col>

                    <Col>
                      <Form.Item
                        label="Invoice address"
                        name="invoice_address"
                      >
                        <Input placeholder="Optional"  onChange={(val) => setInitialValues({...initialValues, invoice_address: val.target.value})} />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Row>

            <Row  wrap justify={'start'} align={'top'}>
              <Col>
                <Button type="primary" htmlType="submit">Save</Button>
              </Col>
            </Row>

          </Form>
        </div>
      )}
      {isDetailsLock && (
        <div className="order-form locked">
          {initialValues.isBusiness && (initialValues?.invoice_name || initialValues?.invoice_address) ? (
            <h4>
              {initialValues.invoice_name && (
                <span>{initialValues.invoice_name} </span>
              )}
              {initialValues.invoice_address && (
                <span>{initialValues.invoice_address}</span>
              )}
            </h4>
          ) : (
            <h4>{getFullName(user)}</h4>
          )}
          <p>E-mail: {getEmail(user)}</p>
          <p>Phone: {initialValues?.phone}</p>
          <Button type="link" onClick={() => setIsDetailsLock(false)}>Edit Details</Button>
        </div>
      )}

      <div className="order-summary">
        <OrderSummary products={products} />
      </div>

      <div className="proceed-to-payment">
        <Button size="large" style={{ width: '100%' }} onClick={onProceedToPayment}>Proceed To Payment</Button>
      </div>
    </div>
  );
};