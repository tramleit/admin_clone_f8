import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Form, Row } from 'react-bootstrap';

import UpInput from '../UpInput';
import { createCourse } from '~/services/apiCourse';
import { mySwalError, mySwalSuccess } from '~/configs/alert';
import { loadingStart, loadingSuccess } from '~/redux/reducer/authReducer';

function FormCreateCourse({ type }) {
    const [desc, setDesc] = useState('');
    const [slug, setSlug] = useState('');
    const [price, setPrice] = useState(0);
    const [title, setTitle] = useState('');
    const [video, setVideo] = useState('');
    const [icon, setIcon] = useState(null);
    const [image, setImage] = useState(null);
    const [priority, setPriority] = useState(1);
    const [oldPrice, setOldPrice] = useState(0);
    const [inputCount, setInputCount] = useState(1);
    const [comingSoon, setComingSoon] = useState('0');
    const [isWhatLearn, setIsWhatLearn] = useState([]);
    const [preOrderPrice, setPreOrderPrice] = useState(0);

    const fileRef = useRef();
    const iconRef = useRef();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.login.currentUser);

    useEffect(() => {
        return () => {
            image && URL.revokeObjectURL(image.preview);
            icon && URL.revokeObjectURL(icon.preview);
        };
    }, [image, icon]);

    const handleChangeWhatLearn = (e, i) => {
        const updatedWhatLearn = [...isWhatLearn];
        updatedWhatLearn[i] = e.target.value;
        setIsWhatLearn(updatedWhatLearn);
    };

    const handlePrevImage = (e, type) => {
        const file = e.target.files[0];
        file.preview = URL.createObjectURL(file);

        if (type === 'image') {
            setImage(file);
        } else {
            setIcon(file);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        dispatch(loadingStart());

        if (type === 'free') {
            const whatLearn = isWhatLearn.map((desc) => {
                return { description: desc };
            });
            const arrAsJson = JSON.stringify(whatLearn);

            formData.append('title', title);
            formData.append('slug', slug);
            formData.append('video', video);
            formData.append('priority', priority);
            formData.append('whatLearn', arrAsJson);
            formData.append('image', image);
            formData.append('icon', icon);
            formData.append('description', desc);

            const result = await createCourse(currentUser.accessToken, 'free', formData);
            dispatch(loadingSuccess());
            if (result.statusCode === 0) {
                mySwalSuccess(result.message);
            } else {
                mySwalError('fail', result.message);
            }
        } else if (type === 'pro' && comingSoon === '0') {
            const whatLearn = isWhatLearn.map((desc) => {
                return { description: desc };
            });
            const arrAsJson = JSON.stringify(whatLearn);

            formData.append('title', title);
            formData.append('slug', slug);
            formData.append('video', video);
            formData.append('priority', priority);
            formData.append('whatLearn', arrAsJson);
            formData.append('image', image);
            formData.append('icon', icon);
            formData.append('price', price);
            formData.append('oldPrice', oldPrice);
            formData.append('preOrderPrice', preOrderPrice);
            formData.append('comingSoon', comingSoon);

            const result = await createCourse(currentUser.accessToken, 'pro', formData);
            dispatch(loadingSuccess());
            if (result.statusCode === 0) {
                mySwalSuccess(result.message);
            } else {
                mySwalError('fail', result.message);
            }
        } else {
            formData.append('title', title);
            formData.append('slug', slug);
            formData.append('priority', priority);
            formData.append('image', image);
            formData.append('comingSoon', comingSoon);

            const result = await createCourse(currentUser.accessToken, 'pro', formData);
            dispatch(loadingSuccess());
            if (result.statusCode === 0) {
                mySwalSuccess(result.message);
            } else {
                mySwalError('fail', result.message);
            }
        }
    };

    const handleRemoveInput = () => {
        setInputCount(inputCount - 1);
    };

    return (
        <Form className="p-5">
            <Row>
                <Col sm={5}>
                    {type === 'pro' && (
                        <Form.Group className="mb-3">
                            <Form.Label>S???p c??:</Form.Label>
                            <select
                                className="form-control"
                                value={comingSoon}
                                onChange={(e) => setComingSoon(e.target.value)}
                            >
                                <option value="1">S???p c??</option>
                                <option value="0">???? c??</option>
                            </select>
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>T??n kh??a h???c:</Form.Label>
                        <Form.Control
                            placeholder="Nh???p t??n kh??a h???c"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>???????ng d???n slug:</Form.Label>
                        <Form.Control
                            placeholder="Nh???p ???????ng d???n slug"
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                        />
                    </Form.Group>
                    {comingSoon === '0' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Url video gi???i thi???u:</Form.Label>
                            <Form.Control
                                placeholder="Nh???p url video"
                                type="text"
                                value={video}
                                onChange={(e) => setVideo(e.target.value)}
                            />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>S??? ??u ti??n:</Form.Label>
                        <Form.Control
                            placeholder="S??? ??u ti??n s???p x???p"
                            type="text"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        />
                    </Form.Group>

                    {type === 'pro' && comingSoon === '0' && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Gi??:</Form.Label>
                                <Form.Control
                                    placeholder="Nh???p gi?? kh??a h???c"
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Gi?? c??:</Form.Label>
                                <Form.Control
                                    placeholder="Nh???p gi?? c??"
                                    type="text"
                                    value={oldPrice}
                                    onChange={(e) => setOldPrice(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Gi?? ?????t tr?????c:</Form.Label>
                                <Form.Control
                                    placeholder="Nh???p gi?? ?????t tr?????c"
                                    type="text"
                                    value={preOrderPrice}
                                    onChange={(e) => setPreOrderPrice(e.target.value)}
                                />
                            </Form.Group>
                        </>
                    )}

                    {type === 'free' && (
                        <Form.Group>
                            <Form.Label>M?? t??? kh??a h???c:</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Nh???p m?? t??? kh??a h???c"
                                style={{ height: '100px' }}
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </Form.Group>
                    )}
                </Col>

                <Col sm={7}>
                    {(type !== 'pro' || comingSoon === '0') && (
                        <UpInput
                            count={inputCount}
                            setCount={setInputCount}
                            data={isWhatLearn}
                            onChange={handleChangeWhatLearn}
                            onClick={handleRemoveInput}
                        />
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>???nh xem tr?????c</Form.Label>
                        {image?.preview && (
                            <img
                                className="ms-4 mb-4"
                                src={image.preview}
                                alt="Preview"
                                style={{
                                    width: '140px',
                                    height: 'auto',
                                    borderRadius: 4,
                                }}
                            />
                        )}
                        <div className="mx-4">
                            <Button variant="success" size="sm" onClick={() => fileRef.current.click()}>
                                Ch???n ???nh
                            </Button>
                            <Form.Control
                                ref={fileRef}
                                onChange={(e) => handlePrevImage(e, 'image')}
                                type="file"
                                hidden
                            />
                        </div>
                    </Form.Group>

                    {(type !== 'pro' || comingSoon === '0') && (
                        <Form.Group className="mb-3">
                            <Form.Label>Icon</Form.Label>
                            {icon?.preview && (
                                <img
                                    className="ms-4 mb-4"
                                    src={icon.preview}
                                    alt="Preview"
                                    style={{
                                        width: '40px',
                                        height: 'auto',
                                        borderRadius: 4,
                                    }}
                                />
                            )}
                            <div className="mx-4">
                                <Button variant="success" size="sm" onClick={() => iconRef.current.click()}>
                                    Ch???n ???nh
                                </Button>
                                <Form.Control
                                    ref={iconRef}
                                    onChange={(e) => handlePrevImage(e, 'icon')}
                                    type="file"
                                    hidden
                                />
                            </div>
                        </Form.Group>
                    )}
                </Col>
            </Row>
            <Button variant="success" className="float-end my-5" onClick={handleCreateCourse}>
                Th??m kh??a h???c m???i
            </Button>
        </Form>
    );
}

export default FormCreateCourse;
