import { useState } from 'react';
import { X } from 'lucide-react';
export default function CVVModal({ isOpen, onClose, onConfirm }) {
    const [cvv, setCvv] = useState('');
    const handleSubmit = () => {
        if (!cvv || cvv.length < 3) {
            return;
        }
        onConfirm(cvv);
        setCvv('');
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirmar Pagamento</h2>
                <p className="text-gray-600 mb-6">Digite o CVV do cartão para processar o pagamento</p>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV (código de segurança)
                    </label>
                    <input
                        type="text"
                        maxLength="4"
                        placeholder="123"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-center text-2xl font-mono tracking-wider"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && cvv.length >= 3) {
                                handleSubmit();
                            }
                        }}
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={cvv.length < 3}
                        className={`flex-1 py-3 rounded-full font-semibold text-white transition-all ${cvv.length >= 3
                            ? 'bg-green-600 hover:bg-green-700 active:scale-95'
                            : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}