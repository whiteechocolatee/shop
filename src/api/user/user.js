let users ={
    get:()=>{
        try {
            let response = await fetch('url');
            let data = await response.json();
            return data;
          } catch (err) {
            return err;
          }
    },
    post:(userData)=>{
        try {
            let response = await fetch('url', userData);
            let data = await response.json();
            return data;
          } catch (err) {
            return err;
          }
    }
}