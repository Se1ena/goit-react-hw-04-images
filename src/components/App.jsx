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
  const [objectCount, setObjectCount] = useState(0);


  useEffect(() => {
    if (search === '') {
      setStatus('start');
      return;
    }
    const fetchImages = async (search, page) => {
      axios.defaults.baseURL = 'https://pixabay.com/api';
      try {
        setStatus('loading');
        const res = await axios.get(`/?key=31381187-b432f12d58670729bf0a21c9a&per_page=12&q=${search}&page=${page}`);
        if (page === 1) {
          toast.info(`Hooray! We found ${res.data.total} image(s).`);
          setObjectCount(res.data.total);
        }
        if (res.data.total === 0) {
          throw new Error('Images with your querry was not found');
        }
        setGalleryItems(prevState => [
          ...prevState,
          ...getGalleryItems(res.data.hits),
        ]);
        setStatus('loaded');
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
    setGalleryItems([]);
    setPage(1);
    setSearch(value.search);    
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
      {status === 'loaded' && objectCount !== galleryItems.length && <Button loadMore={loadMore} />}
      {modalImg && <Modal image={modalImg} onModalClose={handleModal} />}
      <ToastContainer />
    </Wrapper>
  );
};