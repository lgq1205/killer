const app = getApp()

Page({
  data: {
    larray:[],
    rarray:[],
    //img_list:['./Qnan.jpg', './nv.jpg', './yu.jpg'],
    img_list:['image/Qnan.jpg', 'image/Qyu.jpg', 
    'image/nv2.jpg', 'image/lie2.jpg', 'image/bai2.jpg', 
    'image/shou2.jpg', 'image/min2.jpg', 'image/lang2.jpg', 
    'image/langwang2.jpg', 'image/bailangwang2.jpg'],
    max_num : 1,
    img_idx : 0
  },

  onLoad: function() {
      const llist = []
      const rlist = []
      for(var i = 0; i < this.data.max_num; ++i) {
        const item = {
            text: i + 1,
            img_id : this.data.img_idx
        }
        if (i < this.data.max_num / 2)
          llist.push(item)
        else
          rlist.push(item)
      }

      this.setData({
        larray : llist,
        rarray : rlist,
      })
      console.log("lsize: " + this.data.larray.length + " rsize: " + this.data.rarray.length)
  },

  imgclick: function(e) {
    var current_img = Number(e.currentTarget.id - 1)
    var current_idx = current_img
    if (current_img >= this.data.max_num / 2)
      current_idx -= this.data.max_num / 2
    let tmp_img_id = 0
    if (current_img < this.data.max_num / 2)
      tmp_img_id = this.data.larray[current_idx].img_id
    else {
      tmp_img_id = this.data.rarray[current_idx].img_id
    }
    tmp_img_id = (tmp_img_id + 1) % this.data.img_list.length
    if (current_img < this.data.max_num / 2) {
      this.setData({
        [`larray[${current_idx}].img_id`] : tmp_img_id,
      })
    } else {
      this.setData({
        [`rarray[${current_idx}].img_id`] : tmp_img_id,
      })
    }
  },
  changenum: function(e) {
    const m_num = e.detail.value
    console.log(m_num)
    this.setData({
      max_num : m_num
    })
    this.onLoad()
  }
})
