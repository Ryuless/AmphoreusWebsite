import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { rules } from '../../data/mockData'

export function AuthModal({ modal, close, setModal, setPage, setToast, setAuthenticated, agreed, setMember, setRulesOpen }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}><div className="modal"><button className="modal-close" onClick={close}>×</button><span className="modal-mark">A</span><p className="eyebrow">{modal === 'login' ? 'Selamat datang kembali' : 'Mulai perjalananmu'}</p><h2>{modal === 'login' ? 'Masuk ke akun.' : 'Gabung Amphoreus.'}</h2>{modal === 'login' ? <LoginForm setModal={setModal} setPage={setPage} setToast={setToast} setAuthenticated={setAuthenticated} close={close} /> : <RegisterForm agreed={agreed} setModal={setModal} setPage={setPage} setToast={setToast} setAuthenticated={setAuthenticated} setMember={setMember} setRulesOpen={setRulesOpen} close={close} />}</div></div>
}

export function RulesModal({ setRulesOpen, setAgreed }) {
  return <div className="rules-backdrop"><div className="rules-modal"><button className="modal-close" onClick={() => setRulesOpen(false)}>×</button><p className="eyebrow">Official server rules</p><h2>Aturan komunitas</h2><pre>{rules}</pre><button className="button button-primary full-width" onClick={() => { setAgreed(true); setRulesOpen(false) }}>Mengerti</button></div></div>
}
