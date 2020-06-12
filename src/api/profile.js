import require from '@/utils/require';

export function getProfile(oParams){
  return require.get('/get/profile', {
    params: oParams.params
  });
};

export function putProfile(oParams){
  return require.put('/put/profile', oParams.data);
};