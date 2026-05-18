# Elementi Delle Impostazioni

Questa nota definisce la struttura consigliata per la sezione **Impostazioni** della dashboard. L'obiettivo e' organizzare le opzioni in card chiare, utili per l'interfaccia attuale e gia' pronte per un futuro backend.

## 1. Account LinkedIn

Serve per far capire quale profilo LinkedIn usera' l'automazione.

**Campi consigliati**

- Stato account: `Non collegato` / `Collegato`
- Nome profilo LinkedIn
- URL profilo LinkedIn
- Pulsante principale: `Collega LinkedIn`
- Pulsante secondario: `Disconnetti`

**Testo descrittivo**

Gestisci il profilo LinkedIn usato per inviare richieste e follow-up.

Anche senza backend, questa sezione puo' essere lasciata come UI statica.

## 2. Preferenze Outreach

Questa e' la parte piu' importante della sezione Impostazioni, perche' l'automazione invia connessioni e follow-up.

**Campi consigliati**

- Richieste massime al giorno
- Messaggi massimi al giorno
- Ritardo medio tra le azioni
- Modalita' automazione:
  - Prudente
  - Standard
  - Spinta
- Pausa automatica se un lead risponde
- Pausa nei weekend

**Esempio UX**

**Modalita' prudente**  
Riduce il numero di azioni giornaliere per mantenere un comportamento piu' naturale.

## 3. Orari Automazione

La Home contiene gia' il controllo `Start outreach at`; nelle Impostazioni vanno invece definite le regole generali.

**Campi consigliati**

- Ora di inizio predefinita
- Ora di fine attivita'
- Giorni attivi:
  - Lun
  - Mar
  - Mer
  - Gio
  - Ven
- Toggle: `Disattiva sabato e domenica`
- Timezone

**Testo descrittivo**

Definisci quando l'automazione puo' lavorare sul tuo profilo.

## 4. ICP E Targeting

Il form completo dell'ICP deve rimanere in Home. Nelle Impostazioni vanno inserite solo preferenze globali.

**Campi consigliati**

- Settore target
- Ruolo target
- Area geografica
- Dimensione azienda
- Escludi profili gia' contattati
- Escludi lead senza foto profilo
- Escludi profili senza descrizione chiara

## 5. Messaggi E Personalizzazione

La tab `Msg` contiene i testi veri dei messaggi. Nelle Impostazioni vanno definite solo le regole di personalizzazione.

**Campi consigliati**

- Lingua messaggi: `Italiano` / `Inglese`
- Tono messaggi:
  - Professionale
  - Amichevole
  - Diretto
- Usa nome del lead
- Usa azienda del lead
- Usa ruolo del lead
- Lunghezza messaggio:
  - Breve
  - Normale
  - Dettagliata

**Testo descrittivo**

Queste preferenze influenzano il modo in cui i messaggi vengono personalizzati.

## 6. Pipeline Lead

Questa sezione definisce le regole automatiche collegate agli stati dei lead e prepara la dashboard per il backend futuro.

**Campi consigliati**

- Sposta automaticamente in `Invito inviato`
- Sposta automaticamente in `Accettati`
- Sposta automaticamente in `Follow-up inviato`
- Sposta in `In conversazione` quando il lead risponde
- Considera opportunita' dopo risposta positiva

## 7. Notifiche

Questa sezione e' utile per collegare le notifiche ai dati operativi gia' presenti nella dashboard, incluso il grafico ACR nella tab Attivita'.

**Campi consigliati**

- Notifica quando una connessione viene accettata
- Notifica quando un lead risponde
- Report settimanale ACR
- Avviso se ACR scende sotto una certa soglia
- Avviso se l'automazione e' ferma

## 8. Dati E Reset

Anche se il progetto e' ancora front-end, conviene prevedere una card dedicata a esportazioni, importazioni e dati demo.

**Campi consigliati**

- Esporta lead in CSV
- Esporta attivita'
- Reset dati demo
- Cancella cronologia automazione
- Importa lead manualmente

**Testo descrittivo**

Gestisci esportazioni, importazioni e dati demo della dashboard.

## 9. Aspetto

Sezione opzionale, ma utile per una UI dark/neon come quella attuale.

**Campi consigliati**

- Tema scuro / chiaro
- Layout compatto
- Effetti animati on/off
- Riduci animazioni
- Lingua dashboard

## 10. Altro / Avanzate

Questa card deve rimanere piccola e contenere solo elementi secondari. Non deve diventare una sezione generica troppo grande.

**Campi consigliati**

- Versione app
- Stato sistema
- Log attivita'
- Funzioni beta
- Supporto
- Privacy policy
- Termini di utilizzo

## Struttura Finale Consigliata

La sezione **Impostazioni** dovrebbe essere composta da queste card:

1. Account LinkedIn
2. Preferenze outreach
3. Orari automazione
4. ICP e targeting
5. Messaggi e personalizzazione
6. Pipeline lead
7. Notifiche
8. Dati e reset
9. Aspetto
10. Altro
