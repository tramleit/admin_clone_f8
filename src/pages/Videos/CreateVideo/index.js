import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';

import { iso8601ToTimeString } from '~/configs';
import { mySwalError, mySwalSuccess } from '~/configs/alert';
import { createVideo, getInfoVideo } from '~/services/apiVideo';

function CreateVideo({ show, setShow }) {
    const [url, setUrl] = useState('');
    const [view, setView] = useState(0);
    const [like, setLike] = useState(0);
    const [time, setTime] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [comment, setComment] = useState(0);
    const [priority, setPriority] = useState(1);
    const [active, setActive] = useState(false);

    const currentUser = useSelector((state) => state.auth.login.currentUser);

    const handleCreateVideo = async () => {
        if (active) {
            const newVideo = {
                title,
                image,
                urlVideo: url,
                timeVideo: iso8601ToTimeString(time),
                view,
                like,
                comment,
                priority,
            };
            const result = await createVideo(currentUser.accessToken, newVideo);

            if (result.statusCode === 0) {
                mySwalSuccess(result.message);
            } else {
                mySwalError('fail', result.message);
            }
        } else {
            if (!url) {
                mySwalError('error', 'Url video là bắt buộc');
                return;
            }
            const result = await getInfoVideo(url);

            if (result.statusCode === 0) {
                setActive(true);

                result.data.map((item) => {
                    setImage(item.snippet.thumbnails.maxres.url);
                    setTime(item.contentDetails.duration);
                    setTitle(item.snippet.title);
                    setView(item.statistics.viewCount);
                    setLike(item.statistics.likeCount);
                    setComment(item.statistics.commentCount);

                    return item;
                });
            } else {
                mySwalError('fail', result.message);
            }
        }
    };

    return (
        <Modal size="lg" show={show} onHide={() => setShow(false)}>
            <Modal.Header>
                <Modal.Title>Thêm mới video</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Url video</Form.Label>

                                <Form.Control
                                    type="text"
                                    placeholder="Vd: 9jUUXdw8Jrg"
                                    disabled={active}
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </Form.Group>

                            {active && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Ảnh nền</Form.Label>

                                    <Card.Img src={image} alt={title} style={{ border: '1px solid #99999' }} />
                                </Form.Group>
                            )}
                        </Col>

                        {active && (
                            <Col sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tiêu đề video</Form.Label>

                                    <Form.Control
                                        type="text"
                                        placeholder="Tiêu đề video"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Sự ưu tiên ( Stt ưu tiên khi hiển thị )</Form.Label>

                                    <Form.Control
                                        type="text"
                                        placeholder="Tiêu đề video"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                    />
                                </Form.Group>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Thời gian</Form.Label>

                                            <Form.Control
                                                type="text"
                                                placeholder="Thời gian"
                                                disabled
                                                value={iso8601ToTimeString(time)}
                                                onChange={(e) => setTime(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Lượt xem</Form.Label>

                                            <Form.Control
                                                type="text"
                                                placeholder="Lượt xem"
                                                disabled
                                                value={view}
                                                onChange={(e) => setView(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Lượt thích</Form.Label>

                                            <Form.Control
                                                type="text"
                                                placeholder="Lượt thích"
                                                disabled
                                                value={like}
                                                onChange={(e) => setLike(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Bình luận</Form.Label>

                                            <Form.Control
                                                type="text"
                                                placeholder="Bình luận"
                                                disabled
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        )}
                    </Row>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button size="sm" variant="secondary" onClick={() => setShow(false)}>
                    Đóng
                </Button>
                <Button size="sm" variant="primary" onClick={handleCreateVideo}>
                    {active ? 'Thêm mới' : 'Lấy dữ liệu'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateVideo;
