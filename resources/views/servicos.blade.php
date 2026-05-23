@extends('layouts.app')

@section('title', 'Serviços - WebContabil')
@section('page', 'servicos')

@section('content')
    <main class="max-w-6xl mx-auto px-4 py-20">
        <h1 class="text-4xl font-bold theme-text-high mb-6">Serviços</h1>
        <a href="/" class="inline-flex items-center gap-2 rounded-full px-5 py-3 bg-brand text-white hover:bg-brand-light transition mb-10">
            ← Voltar ao Início
        </a>
        <p class="text-lg theme-text-low leading-relaxed mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus lacus
            sit amet velit consequat, sit amet fermentum odio venenatis.
        </p>
        <p class="text-base theme-text-low leading-relaxed">
            Aliquam erat volutpat. Vestibulum ante ipsum primis in faucibus orci luctus et
            ultrices posuere cubilia curae; Integer id lectus nec est egestas ullamcorper.
        </p>
    </main>
@endsection
