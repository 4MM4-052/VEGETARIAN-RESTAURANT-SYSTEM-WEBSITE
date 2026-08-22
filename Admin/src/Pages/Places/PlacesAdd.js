import { Link } from 'react-router-dom'

export default function PlacesAdd () {
    return (
        <div className="container">
            <div className="page-inner">
                <div className="row">
                    <form className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm thứ hạng khách hàng</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label for="name">Mã khách hàng</label>
                                            <input type="text" className="form-control" id="name" placeholder="Nhập tên mã khách hàng"/>
                                        </div>
                                        <div className="form-group">
                                            <label>Thứ hạng</label>
                                            <select defaultValue="1" className="form-select">
                                                <option>Bạc</option>
                                                <option>Vàng</option>
                                                <option>Kim Cương</option>
                                            </select>
                                        </div>
                                        
                                    </div>
                                    <div className="col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label for="price">Điểm tích lũy</label>
                                            <input type="text" className="form-control" id="price" placeholder="Nhập điểm tích lũy"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                            <label for="description">Mô tả</label>
                                            <textarea className="form-control" id="description" rows="4"></textarea>
                                        </div>
                            </div>
                            <div className="card-action">
                                <div className="btn-group mt-3" role="group">
                                    <button className="btn btn-success">Xác nhận</button>
                                    <button className="btn btn-danger">Hủy</button>
                                </div>   
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}