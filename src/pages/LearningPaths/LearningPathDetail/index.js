import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Table, Form, Accordion, Card } from 'react-bootstrap';

import AccordionItem from '../Accordion';
import { uploadImage } from '~/services/slideshow';
import HeadingTable from '~/components/HeadingTable';
import { updateLearningPath } from '~/services/apiLearning';
import { mySwalError, mySwalSuccess } from '~/configs/alert';
import { loadingStart, loadingSuccess } from '~/redux/reducer/authReducer';

function LearningPathDetail({ show, setShow, data }) {
    const [slug, setSlug] = useState(data.slug);
    const [image, setImage] = useState(data.image);
    const [title, setTitle] = useState(data.title);
    const [content, setContent] = useState(data.content);
    const [priority, setPriority] = useState(data.priority);
    const [description, setDescription] = useState(data.description);

    const imageRef = useRef();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.login.currentUser);

    const handleSelectImage = async (e) => {
        dispatch(loadingStart());
        let formData = new FormData();
        formData.append('image', e.target.files[0]);

        const result = await uploadImage(currentUser.accessToken, formData);
        dispatch(loadingSuccess());
        if (result.statusCode === 0) {
            setImage(result.data.urlImage);
        } else {
            mySwalError('fail', result.message);
        }
    };

    const handleUpdate = async () => {
        if (!title || !description || !priority || !image || !slug || !content) {
            mySwalError('error', 'Vui lòng nhập thông tin');
            return;
        } else {
            const LearningPath = {
                title,
                content,
                description,
                image,
                priority,
                slug,
            };

            const result = await updateLearningPath(currentUser.accessToken, LearningPath, data._id);

            if (result.statusCode === 0) {
                mySwalSuccess(result.message);
            } else {
                mySwalError('fail', result.message);
            }
        }
    };

    return (
        <Modal show={show} onHide={() => setShow(false)} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>{data.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered>
                    <HeadingTable
                        headings={[{ title: 'Tên mô tả' }, { title: 'Giá trị hiện tại' }, { title: 'Hành động' }]}
                    />

                    <tbody>
                        <tr>
                            <td className="text-center">Tên lộ trình</td>
                            <td className="text-center">
                                <Form.Group>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tên lộ trình"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Form.Group>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-center">Slug</td>
                            <td className="text-center">
                                <Form.Group>
                                    <Form.Control
                                        type="text"
                                        placeholder="Slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                    />
                                </Form.Group>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-center">Sự ưu tiên</td>
                            <td className="text-center">
                                <Form.Group>
                                    <Form.Control
                                        type="text"
                                        placeholder="Sự ưu tiên"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                    />
                                </Form.Group>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-center">Ảnh nền</td>
                            <td className="text-center">
                                <Card style={{ width: '18rem', margin: 'auto' }}>
                                    <Card.Img src={image} alt="Preview" />
                                </Card>
                            </td>
                            <td className="text-center">
                                <Button variant="success" size="sm" onClick={() => imageRef.current.click()}>
                                    Chọn ảnh
                                </Button>
                                <Form.Control ref={imageRef} onChange={handleSelectImage} type="file" hidden />
                            </td>
                        </tr>

                        <tr>
                            <td className="text-center">Nội dung</td>
                            <td className="text-center">
                                <Form.Group>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Nội dung lộ trình"
                                        style={{ height: 160 }}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </Form.Group>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-center">Mô tả</td>
                            <td className="text-center">
                                <Form.Group>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Mô tả lộ trình"
                                        style={{ height: 100 }}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Form.Group>
                            </td>
                        </tr>
                    </tbody>
                </Table>

                <Form.Label className="mb-2 mt-3">Nhóm khóa học:</Form.Label>
                <Accordion className="mb-4">
                    {data.groups.map((group, index) => (
                        <AccordionItem key={group._id} data={group} index={index} />
                    ))}
                </Accordion>

                <Button className="float-end ms-2" size="sm" onClick={handleUpdate}>
                    Cập nhật
                </Button>
                <Button variant="secondary" className="float-end" size="sm" onClick={() => setShow(false)}>
                    Đóng
                </Button>
            </Modal.Body>
        </Modal>
    );
}

export default LearningPathDetail;
