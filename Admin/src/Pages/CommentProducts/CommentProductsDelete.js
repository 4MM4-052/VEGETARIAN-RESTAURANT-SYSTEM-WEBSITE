import { Link } from 'react-router-dom'

export default function CommentProductsDelete () {
    return (
        <div className="container">
            <div className="page-inner">
                <div className="row">
                    <form class="col-md-12">
                        <div className="card">
                            <h5 class="card-header">Xác nhận xóa đánh giá sản phẩm này</h5>
                            <div className="card-body">
                                <form action="process_delete.php" method="post">
                                    <p class="card-text">Bạn có chắc muốn xóa đánh giá sản phẩm này?</p>
                                    <div className="text-center">
                                        <div className="btn-group mt-3" role="group">
                                            <button type="submit" class="btn btn-success mr-2" name="confirm" value="yes">Có, xóa bàn ăn</button>
                                            <button type="submit" class="btn btn-danger" name="confirm" value="no">Không, quay lại</button>
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