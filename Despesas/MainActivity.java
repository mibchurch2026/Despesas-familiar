package com.exemplo.despesas;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView myWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        myWebView = findViewById(R.id.webview);
        WebSettings webSettings = myWebView.getSettings();
        
        // Habilita JavaScript e armazenamento local (essencial para suas despesas)
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setDatabaseEnabled(true);

        // Melhora a compatibilidade com recursos de interface (Alertas, etc)
        myWebView.setWebViewClient(new WebViewClient());
        myWebView.setWebChromeClient(new WebChromeClient());
        
        // Carrega o arquivo HTML que você criou
        myWebView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        // Se o WebView puder voltar (ou se houver algo para fechar no histórico), ele volta
        if (myWebView.canGoBack()) {
            myWebView.goBack();
        } else {
            // Caso contrário, fecha o app normalmente
            super.onBackPressed();
        }
    }
}