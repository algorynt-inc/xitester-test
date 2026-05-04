import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Runs from './pages/Runs'
import RunDetail from './pages/RunDetail'
import Trigger from './pages/Trigger'
import InFlight from './pages/InFlight'
import TestHistory from './pages/TestHistory'

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                element={
                    <RequireAuth>
                        <Layout />
                    </RequireAuth>
                }
            >
                <Route index element={<Overview />} />
                <Route path="runs" element={<Runs />} />
                <Route path="runs/:runId" element={<RunDetail />} />
                <Route path="trigger" element={<Trigger />} />
                <Route path="in-flight/:runId" element={<InFlight />} />
                <Route path="tests/:tcId" element={<TestHistory />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
