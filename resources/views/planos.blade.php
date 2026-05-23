@extends('layouts.app')

@section('title', 'Planos - WebContabil')
@section('page', 'planos')

@section('content')
    <main class="max-w-6xl mx-auto px-4 py-20">
        <h1 class="text-4xl font-bold theme-text-high mb-6">Planos</h1>
        <a href="/" class="inline-flex items-center gap-2 rounded-full px-5 py-3 bg-brand text-white hover:bg-brand-light transition mb-10">
            ← Voltar ao Início
        </a>
        <p class="text-lg theme-text-low leading-relaxed mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet neque
            sed libero commodo accumsan.
        </p>
        <p class="text-base theme-text-low leading-relaxed">
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Nulla aliquet, magna in aliquet tincidunt, sapien elit pulvinar ligula.
        </p>
    </main>
@endsection
