import { Link } from 'react-router-dom'

export default function  PayMethodAdd () {
    return (
        <div className="container">
            <div className="page-inner">
                <div className="row">
                    <form className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm hóa đơn thanh toán</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                    <div className="form-group">
                                            <label>Mã đơn hàng</label>
                                            <select defaultValue="1" className="form-select">
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                            </select>
                                    </div>
                                    <div className="form-group">
                                            <label>Mã khách hàng</label>
                                            <select className="form-select">
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                            </select>
                                    </div>
                                    </div>
                                    <div className="col-md-6">
                                    <div className="form-group">
                                            <label>Phương thức thanh toán</label>
                                            <select defaultValue="1" className="form-select">
                                                <option>Tiền mặt</option>
                                                <option>Chuyển khoản</option>
                                            </select>
                                    </div>
                                        <div className="form-group">
                                            <label for="price">Số tiền thanh toán</label>
                                            <input type="text" className="form-control" id="price" placeholder="Nhập số lượng người"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-action">
                                <div className="btn-group mt-3" role="group">
                                    <button className="btn btn-success">Submit</button>
                                    <button className="btn btn-danger">Cancel</button>
                                </div>   
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}