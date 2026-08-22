import { Link } from 'react-router-dom'

export default function ProductDelete () {
    return (
        <div className="container">
            <div className="page-inner">
                <div className="row">
                    <form className="col-md-12">
                        <div className="card">
                            <h5 className="card-header">Xác nhận xóa sản phẩm</h5>
                            <div className="card-body">
                                <form action="process_delete.php" method="post">
                                    <p className="card-text">Bạn có chắc muốn xóa sản phẩm này?</p>
                                    <div className="text-center">
                                        <div className="btn-group mt-3" role="group">
                                            <button type="submit" className="btn btn-success mr-2" name="confirm" value="yes">Có, xóa sản phẩm</button>
                                            <button type="submit" className="btn btn-danger" name="confirm" value="no">Không, quay lại</button>
                                        </div>   
                                    </div>
                                </form>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}