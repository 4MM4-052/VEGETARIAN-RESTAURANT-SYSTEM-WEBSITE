import { Link } from 'react-router-dom'

export default function CustomerGroupEdit () {
    return (
        <div className="container">
            <div className="page-inner">
                <div className="row">
                    <form className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Sửa nhóm khách hàng</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label for="name">Tên nhóm khách hàng</label>
                                            <input type="text" class="form-control" id="name" placeholder="Nhập tên nhóm khách hàng"/>
                                        </div>
                                        <div className="form-group">
                                            <label>Phần trăm ưu đãi</label>
                                            <select defaultValue="1" class="form-select">
                                                <option>10%</option>
                                                <option>15%</option>
                                                <option>20%</option>
                                                <option>25%</option>
                                                <option>30%</option>
                                            </select>
                                        </div>
                                        
                                    </div>
                                    <div className="col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label for="price">Điểm tích lũy</label>
                                            <input type="text" class="form-control" id="price" placeholder="Nhập điểm tích lũy"/>
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