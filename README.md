# Laboratório 4 - Parte B: NOC Dashboard

Versão em React + Vite do laboratório de NOC modular, com falha granular por link.

## Executar

```powershell
npm.cmd install
npm.cmd run dev
```

## Regras de dependência

- Carro e Caminhonete -> Link VSAT Principal (ID 1)
- Caminhão -> Link VSAT BGAN (ID 2)
- Van, SUV, Esportivo, Trator e Ambulância -> Roteamento OSPF (ID 3)
- Ônibus -> Sessão BGP (ID 4)
- Moto -> LTE-Móvel (ID 5)

## Teste principal

1. Abra `Links Comunicação`.
2. Derrube `Sessão BGP` e `Roteamento OSPF`.
3. Abra `Ônibus`: deve ficar offline por depender do BGP.
4. Abra `Carro`: deve continuar online por depender do VSAT principal.
5. Abra `Van` e `Ambulância`: devem ficar offline/congeladas por dependerem do OSPF.
6. Restaure cada link e confirme a recuperação independente.

A ambulância usa Web Audio API para sintetizar uma sirene Hi-Lo. Se o navegador bloquear autoplay, clique uma vez na página antes de abrir a aba Ambulância.
