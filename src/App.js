// import './App.css';
import React, { Component } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Hasil, ListCategories, NavbarComponent, Menus, } from "./components";
import { API_URL } from './utils/constanst';
import axios from 'axios';
import swal from 'sweetalert';

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menus: [],
      categoriYangDipilih: 'Makanan',
      keranjangs: []

    }
  }

  componentDidMount() {
    axios
      .get(API_URL + "products?category.nama=" + this.state.categoriYangDipilih)
      .then((res) => {
        const menus = res.data;
        this.setState({ menus });
      })
      .catch(error => {
        console.info(error);
      })

      axios
      .get(API_URL + "keranjangs" )
      .then((res) => {
        const keranjang = res.data;
        this.setState({ keranjang });
      })
      .catch(error => {
        console.info(error);
      })
  }

  changeCategory = (value) => {
    this.setState({
      categoriYangDipilih: value,
      menus: []
    })

    axios
      .get(API_URL + "products?category.nama=" + value)
      .then((res) => {
        const menus = res.data;
        this.setState({ menus });
      })
      .catch(error => {
        console.info(error);
      })
  }

  masukKeranjang = (value) => {

    axios
      .get(API_URL + "keranjangs?product.id=" + value.id)
      .then((res) => {
        if(res.data.length === 0){
          const keranjang = {
            jumlah: 1,
            total_harga: value.harga,
            product: value
          }
      
          axios
            .post(API_URL + "keranjangs", keranjang)
            .then((res) => {
              swal({
                title: "Masuk ke ranjang!",
                text: "Sukses Masuk Ke Ranjang" + keranjang.product.nama,
                icon: "success",
                button: false,
                timer: 1500,
              });
            })
            .catch(error => {
              console.info(error);
            })
        }else{
          const keranjang = {
            jumlah: res.data[0].jumlah+1,
            total_harga: res.data[0].total_harga+value.harga,
            product: value,
          }
          axios
            .put(API_URL + "keranjangs/"+res.data[0].id, keranjang)
            .then((res) => {
              swal({
                title: "Masuk ke ranjang!",
                text: "Sukses Masuk Ke Ranjang" + keranjang.product.nama,
                icon: "success",
                button: false,
                timer: 1500,
              });
            })
            .catch(error => {
              console.info(error);
            })
        }

      })
      .catch(error => {
        console.info(error);
      })

    
  }

  render() {
    const { menus, categoriYangDipilih, keranjangs } = this.state
    return (
      <div className="App">
        <NavbarComponent />
        <div className="mt-3">
          <Container fluid>
            <Row>
              <ListCategories changeCategory={this.changeCategory} categoriYangDipilih={categoriYangDipilih} />
              <Col>
                <h4><strong>Daftar Produk</strong></h4>
                <hr />
                <Row>
                  {menus && menus.map((menu) => (
                    <Menus
                      key={menu.id}
                      menu={menu}
                      masukKeranjang={this.masukKeranjang}
                    />
                  ))}
                </Row>
              </Col>
              <Hasil keranjangs={keranjangs}/>
            </Row>
          </Container>
        </div>

      </div>
    )

  }
}


