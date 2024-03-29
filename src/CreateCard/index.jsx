import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select, Input, Button, Modal, Form, Checkbox } from 'antd';
import './styles.scss';

const FormCard = () => {
    const [rootData, setRootData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [dataCustomer, setDataCustomer] = useState([]);
    const [selectedProductKeys, setSelectedProductKeys] = useState([]);
    const [customerSelected, setCustomerSelected] = useState('');
    const [modal, setModal] = useState(false);
    const [packaging, setPackaging] = useState([]);
    const [chiphi, setChiphi] = useState([]);

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
    const handleSubmitData = () => {
        const dataBody = {
            customer: customerSelected,
            listProduct: selectedProductKeys,
            packaging,
            chiphi
        };
        console.log(dataBody);
    }
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
            </div>
            {modal && <Modal
                open={modal}
                centered
                onCancel={() => {
                    setModal(false);
                }}
                width={"100vw"}
                onOk={() => {
                    handleSubmitData();
                }}
            >
                <Form className="bill">
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
                </Form>
            </Modal>}
        </div>
    )
}

export default FormCard;