import React, { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Wrapper } from './App.styled';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalImg, setModalImg] = useState('');
  const [galleryItems, setGalleryItems] = useState([]);
  const [status, setStatus] = useState('start');

  useEffect(() => {
    if (search === '') {
      setStatus('start');
      return;
    }
    const fetchImages = async (search, page) => {
      axios.defaults.baseURL = 'https://pixabay.com/api';
      try {
        setStatus('loading');
        const res = await axios.get('/?key=31381187-b432f12d58670729bf0a21c9a');
        if (!search) {
          return;
        }
        if (page === 1) {
          toast.info(`Hooray! We found ${res.data.total} image(s).`);
          //calculateTotalPages(res.data.total);
        }
        if (res.data.total === 0) {
          throw new Error('Images with your querry was not found');
        }
        setGalleryItems(prevState => [
          ...prevState,
          ...getGalleryItems(res.data.hits),
        ]);
        setStatus('loaded');
        //this.objectCount(res.data.total);
      } catch (error) {
        toast.error(error.message, {
          position: 'top-center',
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        setStatus('start');
      }
    };
    fetchImages(search, page);
  }, [search, page]);

  const handleFormSubmit = value => {
    setSearch(value.search);
    setGalleryItems([]);
    setPage(1);
  };

  const handleModal = image => {
    setModalImg(image);
  };

  const getGalleryItems = data => {
    return data.map(el => ({
      id: el.id,
      webformatURL: el.webformatURL,
      largeImageURL: el.largeImageURL,
    }));
  };

  //const calculateTotalPages = (total) => {
  //this({ totalPages: Math.ceil(total / 12) });
  //};

  const loadMore = () => {
    setPage(prevState => prevState + 1);
  };

  return (
    <Wrapper>
      <Searchbar onSubmit={handleFormSubmit} />
      {galleryItems.length > 0 && (
        <ImageGallery galleryItems={galleryItems} onClick={handleModal} />
      )}
      {status === 'loading' && <Loader />}
      {status === 'loaded' && <Button loadMore={loadMore} />}
      {modalImg && <Modal image={modalImg} onModalClose={handleModal} />}
      <ToastContainer />
    </Wrapper>
  );
};

//export class App extends Component {
//state = {
//page: 1,
//search: '',
//modalImg: '',
//galleryItems: [],
//status: 'start',
//};

//async componentDidUpdate(prevProps, prevState) {
//const { search, page } = this.state;
//try {
//if (prevState.search !== search || prevState.page !== page) {
//this.setState({ status: 'loading' });
//const res = await fetchImages(search, page);
//if (!search) {
//return;
//}
//if (page === 1) {
//toast.info(`Hooray! We found ${res.data.total} image(s).`);
//this.calculateTotalPages(res.data.total);
//}
//if (res.data.total === 0) {
//throw new Error('Images with your querry was not found');
//}
//this.setState(prevState => ({
//galleryItems: [
//...prevState.galleryItems,
//...this.getGalleryItems(res.data.hits),
//],
//status: 'loaded',
//objectCount: res.data.total,
//}));
//}
//} catch (error) {
//toast.error(error.message, {
//position: 'top-center',
//autoClose: 2500,
//hideProgressBar: true,
//closeOnClick: true,
//pauseOnHover: true,
//draggable: true,
//progress: undefined,
//theme: 'colored',
//});
//this.setState({ status: 'start' });
//}
//}

//handleFormSubmit = value => {
//this.setState({
//search: value.search,
//galleryItems: [],
//page: 1,
//});
//};

//loadMore = () => {
//this.setState(prevState => ({ page: prevState.page + 1 }));
//};

//handleModal = image => {
//this.setState({ modalImg: image });
//};

//getGalleryItems = data => {
//return data.map(el => ({
//id: el.id,
//webformatURL: el.webformatURL,
//largeImageURL: el.largeImageURL,
//}));
//};

//calculateTotalPages(total) {
//this.setState({ totalPages: Math.ceil(total / 12) });
//}

//render() {
//const { status, modalImg, galleryItems, objectCount } = this.state;

//return (
//<Wrapper>
//<Searchbar onSubmit={this.handleFormSubmit} />
//{galleryItems.length > 0 && (
//<ImageGallery
//galleryItems={galleryItems}
//onClick={this.handleModal}
///>
//)}
//{status === 'loading' && <Loader />}

//{status === 'loaded' &&
//(galleryItems.length < objectCount ? (
//<Button loadMore={this.loadMore} />
//) : (
//<span>Nothing to load</span>
//))}
//{modalImg && <Modal image={modalImg} onModalClose={this.handleModal} />}
//<ToastContainer />
//</Wrapper>
//);
//}
//}
