import { Link } from 'react-router-dom'

export default function OrderDetailAdd () {
    return (
        <div className="container">
          <div className="page-inner">
            <div className="row">
              <form className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Thêm chi tiết đơn hàng</div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Mã đơn hàng</label>
                          <select defaultValue="1" className="form-select">
                            <option>1</option>
                            <option>3</option>
                            <option>5</option>
                            <option>7</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Mã sản phẩm</label>
                          <select className="form-select">
                            <option>1</option>
                            <option>3</option>
                            <option>5</option>
                            <option>7</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label for="">Số lượng</label>
                          <input type="number" className="form-control" id="" />
                        </div>
                        </div>
                        <div className="col-md-6">
                        <div className="form-group">
                          <label for="">Giá bán</label>
                          <input type="number" className="form-control" id="" />
                        </div>
                        <div className="form-group">
                          <label for="">Thành tiền</label>
                          <input type="number" className="form-control" id="" />
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
      );
}