import logo from '../assets/img.png';
import './styles.scss';

const initData = {
    contractno: "Contract No",
    khachhang: "For Account and Risk of Messrs",
    shippingline: "Shipping Line",
    shippedper: "Shipped Per",
    portofloading: "Port of loading",
    placeofdelivery: "Place of Delivery",
    sailingon: "Sailing on",
    bookingno: "Booking No",
    billofladingno: "Bill of lading no",
    container_sealno: "Container/Seal No"
}
const Bill = (props) => {
    const getDataBill = props.dataBill.data.DonHang;
    const detailBill = props.dataBill.data.ChiTietDonHang.map((item, idx) => {
        return {
            ...item,
            no: idx + 1
        }
    });
    const lastRow = [
        {
            ten_sanpham: 'TOTAL',
            trongluongnet_kg_field: getDataBill.tongsoluong,
            tonggiasanpham: getDataBill.tonggia
        },
        {
            ten_sanpham: 'Say in Total: US  Dollars  Thirty thousand Four hundred forty one and Seventy nine cents only.',
            colSpan: 4
        }
    ];
    detailBill.push(...lastRow);
    const columns = [
        {
            key: 'NO',
            title: 'No',
            dataIndex: 'no',
            render(value) {
                return value;
            },
        },
        {
            key: 'NAME',
            title: 'Commodity & Description',
            dataIndex: 'ten_sanpham',
        },
        {
            key: 'NET_WEIGHT',
            title: 'Net Weight (Kgs)',
            dataIndex: 'trongluongnet_kg_field',
            render(value) {
                return value ? Number(value).toFixed(2) : 0;
            },
            className: 'center'
        },
        {
            key: 'CNF',
            title: 'Unit Price CNF USA (USD)',
            dataIndex: 'giasanpham_kg',
            render(value) {
                return value ? Number(value).toFixed(2) : 0;
            },
            className: 'right'
        },
        {
            key: 'TotalAmount',
            title: 'Total amount (USD)',
            dataIndex: 'tonggiasanpham',
            render(value) {
                return value ? Number(value).toFixed(2) : 0;
            },
            className: 'center'
        }
    ]
    return <div className="generateBill">
        <img src={logo} alt="" className="imgLogo" />
        <h1>COMMERCIAL INVOICE</h1>
        <div className="date">
            Date: 08/10/2023
            <br />
            No:08/10/2023/TPC
        </div>
        <div className="informationBill">
            {Object.keys(initData).map((item, idx) => {
                return <div key={idx} className="row">
                    <div className='left'>{initData[item]}:</div>
                    <div className='right'>{item === "khachhang" ? getDataBill[item].ten : getDataBill[item]}</div>
                </div>
            })}
        </div>
        <div className="tableBill">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((item, idx) => {
                            return <th key={idx}>{item.title}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {detailBill.map((item, idx) => {
                        return <tr key={idx}>
                            {columns.map((col, idxCol) => {
                                return ((idx === detailBill.length - 1) && idxCol === 1) ? <td key={idxCol} className={col.className} colSpan={4}>
                                    {col.dataIndex === 'no' ? item[col.dataIndex] : Number(item[col.dataIndex]) ? (Number(item[col.dataIndex]).toFixed(2) ?? 0) : (item[col.dataIndex] ?? 0)}
                                </td> :
                                    ((idx === detailBill.length - 1) && idxCol > 1 ? null : <td key={idxCol} className={col.className}>
                                        {col.dataIndex === 'no' ? item[col.dataIndex] : Number(item[col.dataIndex]) ? (Number(item[col.dataIndex]).toFixed(2) ?? 0) : (item[col.dataIndex] ?? 0)}
                                    </td>)
                            })}
                        </tr>
                    })}
                </tbody>
            </table>
            <div className="copyright">Payment shall be made by T.T .through Joint Stock Commercial Bank For Foreign Trade of Vietnam, Viet Tri Branch  to Tan Phong Joint Stock Company’s Account No. 080 137 000 6888. Swift code: BFTVVNVX080.</div>
            <div className="forCompany">For and on behalf of Tan Phong Joint Stock Co.</div>
        </div>
    </div>
}
export default Bill;
