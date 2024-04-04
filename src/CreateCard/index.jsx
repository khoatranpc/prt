import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Select, Input, Button, Modal, Form, Checkbox } from 'antd';
import Bill from '../Bill';
import './styles.scss';

const createBill = async (dataBody) => {
    const data = await axios.post('https://tanphong.onrender.com/donhang/', dataBody);
    return data;
}
const FormCard = (props) => {
    const nav = useNavigate();
    const [rootData, setRootData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [dataCustomer, setDataCustomer] = useState([]);
    const [selectedProductKeys, setSelectedProductKeys] = useState([]);
    const [customerSelected, setCustomerSelected] = useState('');
    const [modal, setModal] = useState(false);
    const [packaging, setPackaging] = useState([]);
    const [chiphi, setChiphi] = useState([]);
    const { values, touched, handleBlur, handleChange, handleSubmit, setValues, setFieldValue } = useFormik({
        initialValues: {
            contract: '',
            shippingLine: '',
            shippedPer: '',
            consignee: '',
            portOfLoading: '',
            placeOfDelivery: '',
            sailingOn: '',
            bookingOn: '',
            billOfLadingNo: '',
            containerSealNo: '',
        },
        async onSubmit(values) {
            const dataBody = {
                customer: customerSelected,
                listProduct: selectedProductKeys,
                packaging,
                chiphi,
                ...values
            };
            const data = await createBill(dataBody);
            props.setDataBill(data);
        }
    });

    const getColumns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten',
            key: 'NAME'
        },
        {
            title: 'Giá',
            dataIndex: 'gia_final',
            key: 'PRICE'
        },
        {
            title: 'Số lượng',
            render(_, record) {
                return <Input
                    type="number"
                    style={{ width: "200px" }}
                    disabled={selectedProductKeys.findIndex((value) => value.idProduct === record.key) < 0}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        const crrIndexProduct = selectedProductKeys.findIndex((value) => value.idProduct === record.key);
                        if (crrIndexProduct >= 0 && value >= 0) {
                            selectedProductKeys[crrIndexProduct].quantity = value;
                        }
                        setSelectedProductKeys([...selectedProductKeys]);
                    }}
                />
            }
        }
    ];
    const getColumnsBill = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            key: 'NAME'
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity'
        },
    ]
    const queryListProduct = async () => {
        const data = await axios.get("https://tanphong.onrender.com/sanpham/");
        if (data.data) {
            setRootData(data.data);
            setPackaging(data.data.packagking.map((item) => item.id_chiphi));
            setChiphi(data.data.chiphi.map((item) => item.id_chiphi));
            setDataSource((data.data.sanpham.map((item) => {
                return {
                    ...item,
                    key: item.id_sanpham
                }
            })));
            setDataCustomer((data.data.khachhang.map((item) => {
                return {
                    label: item.ten,
                    value: item.id_khachhang
                }
            })));
        }
    }
    const onSelectChange = (newSelectedProductKeys) => {
        const listProduct = newSelectedProductKeys.map((item) => {
            const crrData = dataSource.find(data => data.key === item);
            return {
                idProduct: item,
                quantity: 0,
                productName: crrData?.ten,
                price: crrData?.gia_final,
                weight: crrData?.trong_luong_final
            }
        });
        setSelectedProductKeys(listProduct);
    };
    const rowSelection = {
        selectedProductKeys,
        onChange: onSelectChange,
    };
    useEffect(() => {
        queryListProduct();
    }, []);
    return (
        <div className="formCreateCard">
            <Table
                pagination
                columns={getColumns}
                dataSource={dataSource}
                rowSelection={rowSelection}
            />
            <div className="handleCreateBill">
                <Select
                    showSearch
                    style={{
                        width: 200,
                    }}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    onChange={(value) => {
                        setCustomerSelected(value);
                    }}
                    options={dataCustomer}
                />
                <Button onClick={() => setModal(true)}>Tạo đơn hàng</Button>
                <Button onClick={() => { nav('/bill') }}>Hoá đơn</Button>
            </div>
            {modal && <Modal
                open={modal}
                centered
                onCancel={() => {
                    setModal(false);
                }}
                width={"100vw"}
                okButtonProps={{
                    htmlType: "submit"
                }}
                onOk={handleSubmit}
            >
                <Form className="bill" onSubmit={handleSubmit}>
                    <div className="left">
                        <Form.Item>
                            <label>Tên khách hàng</label>
                            <p><b>{dataCustomer.find((item) => item.value === customerSelected)?.label}</b></p>
                        </Form.Item>
                        <Form.Item>
                            <label>Sản phẩm</label>
                            <Table
                                pagination={false}
                                columns={getColumnsBill}
                                dataSource={selectedProductKeys}
                            />
                        </Form.Item>
                        <div className="moreOptional">
                            <div className="left">
                                <label>Packaging</label>
                                <Checkbox.Group
                                    defaultValue={packaging}
                                    className="checkboxOption"
                                    onChange={(value) => {
                                        setPackaging(value);
                                    }}
                                >
                                    {rootData.packagking?.map((item) => {
                                        return <Checkbox key={item.id_chiphi} value={item.id_chiphi}>{item.ten}</Checkbox>
                                    })}
                                </Checkbox.Group>
                            </div>
                            <div className="right">
                                <label>Gia công</label>
                                <Checkbox.Group
                                    className="checkboxOption"
                                    defaultValue={chiphi}
                                    onChange={(value) => {
                                        setChiphi(value);
                                    }}
                                >
                                    {rootData.chiphi?.map((item) => {
                                        return <Checkbox key={item.id_chiphi} value={item.id_chiphi}>{item.ten}</Checkbox>
                                    })}
                                </Checkbox.Group>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <Form.Item>
                            <label>Contract</label>
                            <Input size="small" name="contract" onChange={handleChange} onBlur={handleBlur} value={values.contract} />
                        </Form.Item>
                        <Form.Item>
                            <label>Shipping Line</label>
                            <Input size="small" name="shippingLine" onChange={handleChange} onBlur={handleBlur} value={values.shippingLine} />
                        </Form.Item>
                        <Form.Item>
                            <label>Shipped Per</label>
                            <Input size="small" name="shippedPer" onChange={handleChange} onBlur={handleBlur} value={values.shippedPer} />
                        </Form.Item>
                        <Form.Item>
                            <label>Consignee</label>
                            <Input size="small" name="consignee" onChange={handleChange} onBlur={handleBlur} value={values.consignee} />
                        </Form.Item>
                        <Form.Item>
                            <label>Port of loading</label>
                            <Input size="small" name="portOfLoading" onChange={handleChange} onBlur={handleBlur} value={values.portOfLoading} />
                        </Form.Item>
                        <Form.Item>
                            <label>Place of Delivery</label>
                            <Input size="small" name="placeOfDelivery" onChange={handleChange} onBlur={handleBlur} value={values.placeOfDelivery} />
                        </Form.Item>
                        <Form.Item>
                            <label>Sailing on</label>
                            <Input size="small" name="sailingOn" onChange={handleChange} onBlur={handleBlur} value={values.sailingOn} />
                        </Form.Item>
                        <Form.Item>
                            <label>Booking No</label>
                            <Input type="number" size="small" name="bookingOn" onChange={handleChange} onBlur={handleBlur} value={values.bookingOn} />
                        </Form.Item>
                        <Form.Item>
                            <label>Bill of lading no</label>
                            <Input size="small" name="billOfLadingNo" onChange={handleChange} onBlur={handleBlur} value={values.billOfLadingNo} />
                        </Form.Item>
                        <Form.Item>
                            <label>Container/Seal no</label>
                            <Input size="small" name="containerSealNo" onChange={handleChange} onBlur={handleBlur} value={values.containerSealNo} />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>}
        </div>
    )
}

export default FormCard;