import { WebSocketProvider } from '@/components/providers/WebSocketProvider';
import { persistor, store } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

export function Providers({ children }: { children: React.ReactNode }) {

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {

        return (
            <Provider store={store}>
                <WebSocketProvider>
                    {children}
                </WebSocketProvider>
            </Provider>
        );
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <WebSocketProvider>
                    {children}
                </WebSocketProvider>
            </PersistGate>
        </Provider>
    );
}
