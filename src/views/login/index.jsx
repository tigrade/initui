import React,{DSBase,DSComponent,Fragment,post} from 'comp/index';
import './index.less'
import * as THREE from "three";
// import * as Stats from "stats-js";

import { InfoCircleOutlined} from '@ant-design/icons';
import { Form, Input,Button ,Checkbox,Row, Col,Modal,Image,message} from 'antd';

class LoginView extends DSComponent{   
    constructor(props){
        super(props);
        this.bgRef = React.createRef();
        this.loginFormRef = React.createRef();
        this.regeditFormRef = React.createRef();
        this.resetFormRef = React.createRef();
        let loginAccount;
        let loginRemember = localStorage.getItem("remember");
        if(loginRemember==="true"){
            loginRemember = true;
            loginAccount = localStorage.getItem("account");
        }else{
            loginRemember = false;
        }
        // formType: Login|Regedit|Forget
        this.state = {formType:"Login",captchShow:false,count:60,liked:true,needCaptcha:false,loginAccount:loginAccount,loginRemember:loginRemember}
    }
    componentDidMount=()=>{
        this.initTHREEBg();
        
    }
    componentDidUpdate=()=>{
    }
    // componentWillReceiveProps=(nextProps,nextContext)=>{
    //     setTimeout(()=>this.onCountDown,1000);
    // }

    initTHREEBg=()=>{
        // const stats = new Stats()
        // stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        // document.body.appendChild(stats.dom)
        const SEPARATION = 100; 
        const AMOUNTX = 50; //控制x轴波浪的长度
        const AMOUNTY = 50; //控制y轴波浪的长度
        let container;
        let camera, scene, renderer;
        let particles; let particle; let count = 0;
        let mouseX = 0;
        let mouseY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;

        const init = (kk) => {
            container = document.createElement('div')
            this.bgRef.current.appendChild(container)
            

            camera = new THREE.PerspectiveCamera(
                75, //摄像机视锥体垂直视野角度
                window.innerWidth / window.innerHeight, //摄像机视锥体长宽比
                1, //摄像机视锥体近端面
                10000 //摄像机视锥体远端面
            );
            //设置相机z轴视野
            camera.position.z = 1000;
            //创建场景
            scene = new THREE.Scene();

            // 添加背景图
            // const texture = new THREE.TextureLoader().load(`${process.env.PUBLIC_URL+'/bg.png'}`);
            // scene.background = texture;

            particles = [];
            const material = new THREE.SpriteMaterial({
                map: new THREE.TextureLoader().load(`${process.env.PUBLIC_URL+'/disc.png'}`),
                color: "#7ec1ff",
            })

            // 初始化粒子位置和大小
            let i = 0
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    particle = particles[i++] = new THREE.Sprite(material);
                    particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
                    particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
                    scene.add(particle);
                }
            }
            // renderer = new THREE.CanvasRenderer();
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            // 设置透明度
            renderer.setClearAlpha(0.2);
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);

            document.addEventListener('mousemove', onDocumentMouseMove, false);
            document.addEventListener('touchstart', onDocumentTouchStart, false)
            document.addEventListener('touchmove', onDocumentTouchMove, false)
            window.addEventListener('resize', onWindowResize, false);
        }

        const onWindowResize = () => {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        const onDocumentMouseMove = (event) => {
            mouseX = event.clientX - windowHalfX;
            if(event.clientY>125){
                mouseY = 125 - windowHalfY;
            }else{
                mouseY = event.clientY - windowHalfY;
            }
            // console.log(`x:${event.clientX},y:${event.clientY}`)
        }

        const onDocumentTouchStart = (event) => {
            if (event.touches.length === 1) {
                event.preventDefault();
                mouseX = event.touches[0].pageX - windowHalfX;
                mouseY = event.touches[0].pageY - windowHalfY;
            }
        }

        const onDocumentTouchMove = (event) => {
            if (event.touches.length === 1) {
                event.preventDefault();
                mouseX = event.touches[0].pageX - windowHalfX;
                mouseY = event.touches[0].pageY - windowHalfY;
            }
        }

        const animate = () => {
            // stats.begin()
            // stats.end()
            requestAnimationFrame(animate);
            render();
        }

        const render = () => {
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            let i = 0;
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    particle = particles[i++];
                    particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
                    particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 2 + (Math.sin((iy + count) * 0.5) + 1) * 2;
                }
            }

            renderer.render(scene, camera);
            count += 0.08;
        }

        // 初始化
        init();
        animate();
    }

    onChangeType=(formType,e)=>{
        e.preventDefault();
        this.setState(state=>{
            state.formType = formType;
            state.formStatus = false;
            state.errorMessage = null;
            return state;
        });
    }
    onClickCaptcha=async (type,use)=>{
        const params = new FormData();
        params.append('type', type);
        params.append('use', use);
        let _account;
        if(use==="LOGIN_CODE"){
            const {account} = this.loginFormRef.current.getFieldsValue();
            _account = account;
        }
        if(use==="REGEDIT_CODE"){
            const {account} = this.regeditFormRef.current.getFieldsValue();
            _account = account;
        }
        if(use==="RESET_PASSWORD_CODE"){
            const {account} = this.resetFormRef.current.getFieldsValue();
            _account = account;
        }
        if(_account===undefined||_account===null){
            message.error("请需填写完整有效的邮箱号码");
            return false;
        }
        params.append('account', _account);
        //获取验证码   /client/token
        const response  = await post(`/api/client/token`,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {check,token} = response;
            this.setState(state=>{
                if(check===true){
                    state.captchShow = !state.captchShow;
                    if(state.captchShow){
                        state.liked = false;
                    }
                }
                if(use==="LOGIN_CODE"){
                    state.LOGIN_TOKEN = token;//登录TOKEN
                }
                if(use==="REGEDIT_CODE"){
                    state.REGEDIT_TOKEN = token;//注册TOKEN
                }
                if(use==="RESET_PASSWORD_CODE"){
                    state.RESET_PASSWORD_TOKEN = token;//重置密码
                }
                return state;
            },(e)=>{
                this.onCountDown();//获取验证码按钮倒计时
            });
        }
    }
    onCaptchaSubmit=(v)=>{

    }
    onCountDown=()=>{
        const {count} = this.state;
        if(count===1){
            this.setState(state=>{
                state.count = 60;
                state.liked = true;
                return state;
            },(e)=>{
                clearTimeout(this._execute)
            });
        }else{
            this.setState(state=>{
                state.count = state.count - 1;
                state.liked = false;
                return state;
            },(e)=>{
                this._execute = setTimeout(()=>{this.onCountDown()},1000);
            });
        }
    }

    onLogin=async (e)=>{
        const {account,password,remember} = e;
        const params = new FormData();
        params.append('username', account);
        params.append('password', password);
        const response  = await post(`/api/sign_in`,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            if(remember===true){
                localStorage.setItem("remember",true);
                localStorage.setItem("account",account);
            }else{
                localStorage.removeItem("remember");
                localStorage.removeItem("account");
            }
            sessionStorage.setItem('isLogin', true);
            sessionStorage.setItem('token', response.token);
            window.location.href = DSBase.root.path;
        }
    }
    onRegedit=async (e)=>{
        const {alias,account,password,checkCode,agree} = e;
        if(agree!==true){
            message.error("请同意平台协议方可注册");
            return false;
        }
        const {REGEDIT_TOKEN} = this.state;
        const data = {'type':"EMAIL",'alias':alias,'account':account,'password':password,'checkCode':checkCode,'token':REGEDIT_TOKEN};
        const params = new FormData();
        params.append('content', JSON.stringify(data));
        const response  = await post(`/api/client/regedit`,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            sessionStorage.setItem('isLogin', true);
            sessionStorage.setItem('token', response.token);
            window.location.href = DSBase.root.path;
        }
    }
    onReset=async(e)=>{
        const {account,password,checkCode} = e;
        const {RESET_PASSWORD_TOKEN} = this.state;
        const data = {'account':account,'password':password,'checkCode':checkCode,'token':RESET_PASSWORD_TOKEN};
        const params = new FormData();
        params.append('content', JSON.stringify(data));
        const response  = await post(`/api/client/reset/password`,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            sessionStorage.setItem('isLogin', true);
            sessionStorage.setItem('token', response.token);
            window.location.href = DSBase.root.path;
        }
    }

    render(){
        //formStatus:false,errorMessage:null
        const {formType,count,liked,needCaptcha,loginAccount,loginRemember} = this.state;
        console.log(loginAccount);
        return (
        <Fragment>
            <Modal
                title={<span className='security-title'>安全验证</span>}
                centered
                maskClosable={false}
                visible={this.state.captchShow}
                width={350}
                onCancel={this.onClickCaptcha}
                closable={true}
                footer={null}>
                    <Form layout="vertical" size='small' onFinish={this.onCaptchaSubmit}>
                        <Form.Item label="图像验证码" required tooltip="看不清,在图片上方点击更换验证码">
                            <Row wrap={false}>
                                <Col flex="150px">
                                    <Form.Item name="code" rules={[{ required: true ,message: '请输入正确的验证码!'}]} noStyle>
                                        <Input placeholder="输入验证码" size="large" maxLength={10} style={{"width":120}} allowClear={true} autoComplete="off"/>
                                    </Form.Item>
                                </Col>
                                <Col flex="auto">
                                    <Form.Item noStyle>
                                        <Image
                                            preview={false}
                                            width={150}
                                            height={40}
                                            src="/api/client/captcha"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>    
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className={'login-form-button'} size="large" style={{"width":"100%"}}>确认</Button>
                        </Form.Item>
                    </Form>
            </Modal>
            <div className={'main-wrap'}>
                <div className={'login'}>
                    <div className={'login-title'}>
                        <h1>鱼律</h1>
                        <h5>鱼律科技 一律给力</h5>
                    </div>
                    {/* 用户登录 */}
                    <div className={'login-wrap'} style={{"display":formType==="Login"?"block":"none"}}>
                        <Form layout="vertical" size='small' onFinish={this.onLogin} ref={this.loginFormRef} 
                            initialValues={{"account":loginAccount,"remember":loginRemember}}>
                            <Form.Item name="account" label="账号" required tooltip="请输入有效账号" rules={[{ required: true, message: '请输入有效账号' }]} >
                                <Input placeholder="请输入有效邮箱账号" size="large" autoComplete="off"/>
                            </Form.Item>
                            <Form.Item name="password" label="密码"  required tooltip={{ title: '请输入有效密码', icon: <InfoCircleOutlined /> }} 
                                rules={[{ required: true, message: '请输入有效密码' }]}>
                                <Input.Password placeholder="请输入有效密码" size="large" autoComplete="off"/>
                            </Form.Item>
                            {needCaptcha&&
                            <Form.Item label="验证码"  required tooltip={{ title: '请输入有效验证码', icon: <InfoCircleOutlined /> }}>
                                <Row gutter={8}>
                                    <Col flex="180px">
                                        <Form.Item name="checkCode" noStyle>
                                            <Input size="large" autoComplete="off" style={{"width":180}}/>
                                        </Form.Item>
                                    </Col>
                                    <Col flex={'auto'}>
                                        <Button size="large" onClick={this.onClickCaptcha.bind(this,"EMAIL","LOGIN_CODE",)} disabled={liked?false:true} style={{"width":"100%"}}>{liked?"获取验证码":`(${count})秒后重试`}</Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                            }
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>记住我</Checkbox>
                                </Form.Item>
                                <a href='#' className={'login-form-forgot'} onClick={this.onChangeType.bind(this,"Forget")}>忘记密码</a>
                            </Form.Item>
                            
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className={'login-form-button'} size="large">登录</Button>
                                <span className={'login-to-regedit'}>或 <Button type="link" onClick={this.onChangeType.bind(this,"Regedit")}>立即注册</Button></span>
                            </Form.Item>
                        </Form>
                    </div>
                    {/* 忘记密码 */}
                    <div className={'forget-wrap'} style={{"display":formType==="Forget"?"block":"none"}}>
                        <Form layout="vertical" size='small' ref={this.resetFormRef} onFinish={this.onReset}>
                            <Form.Item name="account" label="账号" required tooltip="请输入有效账号">
                                <Input placeholder="请输入有效邮箱或手机" size="large" autoComplete="off"/>
                            </Form.Item>
                            <Form.Item name="password" label="新的密码"  required tooltip={{ title: '请输入新密码', icon: <InfoCircleOutlined /> }}>
                                <Input.Password placeholder="请输入新密码" size="large" autoComplete="off"/>
                            </Form.Item>
                            <Form.Item label="验证码"  required tooltip={{ title: '请输入有效验证码', icon: <InfoCircleOutlined /> }}>
                                <Row gutter={8}>
                                    <Col flex="180px">
                                        <Form.Item name="checkCode" noStyle>
                                            <Input size="large" autoComplete="off" style={{"width":180}}/>
                                        </Form.Item>
                                    </Col>
                                    <Col flex={'auto'}>
                                        <Button size="large" onClick={this.onClickCaptcha.bind(this,"EMAIL","RESET_PASSWORD_CODE",)} disabled={liked?false:true} style={{"width":"100%"}}>{liked?"获取验证码":`(${count})秒后重试`}</Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className={'login-form-button'} size="large">重置密码</Button>
                                <span className={'login-to-regedit'}>或去 <a href='' onClick={this.onChangeType.bind(this,"Login")}>登录</a></span>
                            </Form.Item>
                        </Form>
                    </div>
                    
                    {/* 注册用户 */}
                    <div className={'regedit-wrap'} style={{"display":formType==="Regedit"?"block":"none"}}>
                        <Form layout="vertical" size='small' onFinish={this.onRegedit} ref={this.regeditFormRef}>
                            <Form.Item name="alias" label="用户名字" required tooltip="请输入用户名字" 
                                rules={[{ required: true, message: '请输入有效账号' }]} >
                                <Input placeholder="请输入用户名字" size="large" autoComplete="off"/>
                            </Form.Item>
                            <Form.Item name="account" label="邮箱"  required tooltip={{ title: '请输入有效邮箱', icon: <InfoCircleOutlined /> }} 
                                rules={[{ required: true, message: '请输入有效邮箱' },{type: 'email',message: '请输入有效邮箱'}]} >
                                <Input placeholder="请输入有效邮箱" size="large" autoComplete="off"/>
                            </Form.Item>
                            <Form.Item name="password" label="登录密码"  required tooltip={{ title: '请输入有效密码', icon: <InfoCircleOutlined /> }}
                                rules={[{ required: true, message: '请输入有效密码' }]} >
                                <Input.Password placeholder="请输入有效密码" size="large" autoComplete="off"/>
                            </Form.Item>
                            <Form.Item label="验证码"  required tooltip={{ title: '请输入有效验证码', icon: <InfoCircleOutlined /> }}>
                                <Row gutter={8}>
                                    <Col flex="180px">
                                        <Form.Item name="checkCode" noStyle 
                                            rules={[{ required: true, message: '请输入有效验证码' }]} >
                                            <Input size="large" autoComplete="off" style={{"width":180}}/>
                                        </Form.Item>
                                    </Col>
                                    <Col flex={'auto'}>
                                        <Button size="large" onClick={this.onClickCaptcha.bind(this,"EMAIL","REGEDIT_CODE",)} disabled={liked?false:true} style={{"width":"100%"}}>{liked?"获取验证码":`(${count})秒后重试`}</Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="agree" valuePropName="checked" noStyle 
                                    rules={[{ required: true, message: '用户需同意本平台协议方可注册' }]} >
                                <Checkbox>已阅读并同意以下协议<a href='#'>鱼律平台服务协议</a>、<a href='#'>隐私权政策</a>、<a href='#'>法律声明</a>协议</Checkbox>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className={'login-form-button'} size="large">注册</Button>
                                <span className={'regedit-to-login'}>或 <a href='' onClick={this.onChangeType.bind(this,"Login")}>立即登录</a></span>
                            </Form.Item>
                            {/* <Divider>其他注册方式</Divider>
                            <Tooltip title='手机注册'><Avatar style={{ backgroundColor: '#87d068' }} icon={<PhoneOutlined />} /></Tooltip>
                            <Tooltip title='邮箱注册'><Avatar style={{ backgroundColor: '#87d068' }} icon={<MailOutlined />} /></Tooltip> */}
                        </Form>
                    </div>


                </div>
            </div> 
            <div className={'site-footer'}>
                <div className={'banner'}>Copyright © 2018至今 鱼律（厦门）网络科技有限公司 All rights reserved.
                    <a href="//beian.miit.gov.cn" target="_blank" rel="noreferrer">闽ICP备18004543号-1</a>
                </div>
            </div>
            <div ref={this.bgRef} className={'wall-bg'}/>

        </Fragment>
        );
    }
}
export default LoginView;