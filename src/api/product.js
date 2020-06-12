import require from '@/utils/require';

export function getProduct(oParams){
  return require.get('/get/product', {
    params: oParams.params
  });
};

export function getImgProduct(oParams){
  return require.get('/get/img/product', {
    params: oParams.params
  });
};

export function getProductDetail(oParams){
  return require.get('/get/product/detail', {
    params: oParams.params
  });
};

export function postProductAdd(oParams){
  return require.post('/post/product/add', oParams.data);
};

export function deleteProductById(oParams){
  return require.delete('/delete/product',{
  	params: oParams.params
  });
};

export function putProductById(oParams){
  return require.put('/put/product', oParams.data);
};

export function putProductImgById(oParams){
  return require.put('/put/product/img', oParams.data);
};