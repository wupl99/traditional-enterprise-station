import require from '@/utils/require';

export function getNews(oParams){
  return require.get('/get/news', {
    params: oParams.params
  });
};

export function getImgNews(oParams){
  return require.get('/get/img/news', {
    params: oParams.params
  });
};

export function getNewsDetail(oParams){
  return require.get('/get/news/detail', {
    params: oParams.params
  });
};

export function postNewsAdd(oParams){
  return require.post('/post/news/add', oParams.data);
};

export function deleteNewsById(oParams){
  return require.delete('/delete/news',{
  	params: oParams.params
  });
};

export function putNewsById(oParams){
  return require.put('/put/news', oParams.data);
};

export function putNewsImgById(oParams){
  return require.put('/put/news/img', oParams.data);
};